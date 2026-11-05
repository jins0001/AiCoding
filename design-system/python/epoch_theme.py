"""Epoch 차트 테마: matplotlib와 seaborn 차트를 Epoch 디자인 시스템의 값으로 맞춥니다.

노트북에서 (jupyter/ 폴더 기준):

    import sys; sys.path.append("../design-system/python")
    import epoch_theme
    epoch_theme.use()                  # 라이트 테마
    epoch_theme.use("dark")            # 다크 테마
    epoch_theme.color("danger")        # 토큰 값 '#b42318'
    epoch_theme.palette()              # series-1..6 (seaborn deep)
    ax = sns.heatmap(cm, annot=True, cmap="epoch")   # use()가 등록하는 순차 색상표
    epoch_theme.readable_annotations(ax)             # 칸 숫자를 4.5:1 이상으로

IBM Plex Sans KR이 설치되어 있지 않으면 맑은 고딕, AppleGothic, 나눔고딕 순으로 대체합니다.
글꼴 파일을 내려받아 둔 폴더가 있으면 use(fonts_dir="경로")로 등록합니다.

tokens.json을 고친 뒤 스타일 파일을 다시 만들려면:

    python design-system/python/epoch_theme.py
"""
from __future__ import annotations

import json
import warnings
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOKENS = HERE.parent / "tokens.json"
THEMES = ("light", "dark")
SERIES = [f"series-{i}" for i in range(1, 7)]

# tokens.json은 px, matplotlib은 pt. figure.dpi 100에서 1px = 0.72pt.
PX_TO_PT = 0.72
SANS_FALLBACK = ["AppleGothic", "NanumGothic", "Noto Sans CJK KR", "DejaVu Sans"]
MONO_FALLBACK = ["DejaVu Sans Mono"]
GENERIC = {"system-ui", "sans-serif", "serif", "monospace", "ui-monospace", "ui-sans-serif"}


def _tokens() -> dict:
    return json.loads(TOKENS.read_text(encoding="utf-8"))


def color(name: str, theme: str = "light", _data: dict | None = None, _depth: int = 0) -> str:
    """색 토큰 하나의 값을 '#rrggbb'로 돌려줍니다. 별칭({ink-500})은 따라갑니다."""
    data = _data or _tokens()
    first = data["color"]["themes"][0]["id"]
    for tok in data["color"]["tokens"]:
        if tok["name"] != name:
            continue
        value = tok["value"]
        if isinstance(value, dict):
            value = value.get(theme, value[first])
        if value.startswith("{") and _depth < 16:
            return color(value[1:-1], theme, data, _depth + 1)
        return value
    raise KeyError(f"tokens.json에 '{name}' 색 토큰이 없습니다.")


def palette(theme: str = "light") -> list[str]:
    """차트 계열 색 series-1..6."""
    data = _tokens()
    return [color(n, theme, data) for n in SERIES]


def cmap(theme: str = "light"):
    """순차 색상표: surface-300에서 primary로. 혼동 행렬과 히트맵에 씁니다."""
    from matplotlib.colors import LinearSegmentedColormap
    data = _tokens()
    return LinearSegmentedColormap.from_list(
        "epoch", [color("surface-300", theme, data), color("primary", theme, data)])


def _luminance(hex_or_rgb) -> float:
    from matplotlib.colors import to_rgb
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in to_rgb(hex_or_rgb)]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(a, b) -> float:
    """두 색의 WCAG 대비."""
    la, lb = _luminance(a), _luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def readable_annotations(ax, theme: str | None = None) -> None:
    """seaborn heatmap의 칸 숫자를 ink-900과 ink-inverse 중 대비가 높은 색으로 다시 칠합니다.

    seaborn은 밝기 0.408을 기준으로 흰색/회색을 고르는데, 그 근처 칸에서는 대비가 2.3:1까지 떨어집니다.
    """
    from matplotlib.collections import QuadMesh

    theme = theme or _current_theme
    data = _tokens()
    inks = [color("ink-900", theme, data), color("ink-inverse", theme, data)]
    mesh = next((c for c in ax.collections if isinstance(c, QuadMesh)), None)
    if mesh is None:
        return
    values = mesh.get_array()
    ncols = values.shape[1] if getattr(values, "ndim", 1) == 2 else None
    faces = mesh.get_facecolors()
    if ncols is None or len(faces) != values.size:
        return
    for text in ax.texts:
        x, y = text.get_position()
        i = int(y) * ncols + int(x)
        if 0 <= i < len(faces):
            text.set_color(max(inks, key=lambda ink: contrast(ink, faces[i][:3])))


def _style(name: str, data: dict) -> dict:
    for group in data["type"]["groups"]:
        for style in group["styles"]:
            if style["name"] == name:
                return style
    raise KeyError(name)


def _pt(name: str, data: dict) -> float:
    px = float(_style(name, data)["fontSize"].removesuffix("px"))
    return round(px * PX_TO_PT * 2) / 2


def _families(key: str, data: dict) -> list[str]:
    stack = data["type"]["families"][key]
    names = [n.strip().strip('"').strip("'") for n in stack.split(",")]
    return [n for n in names if n and n not in GENERIC]


def style_text(theme: str = "light") -> str:
    """tokens.json에서 .mplstyle 본문을 만듭니다."""
    d = _tokens()
    c = lambda n: color(n, theme, d).lstrip("#")  # .mplstyle에서 '#'은 주석이라 뺍니다.
    cycle = ", ".join(f"'{color(n, theme, d).lstrip('#')}'" for n in SERIES)
    sans = _families("sans", d) + SANS_FALLBACK
    mono = _families("mono", d) + MONO_FALLBACK
    body, heading, label = _pt("body", d), _pt("heading", d), _pt("label", d)
    weight = _style("heading", d)["fontWeight"]
    lines = [
        f"# Epoch {theme} theme for matplotlib. Generated from tokens.json by epoch_theme.py:",
        "# edit tokens.json and rerun the script instead of editing this file.",
        "",
        f"figure.facecolor: {c('surface-000')}  # surface-000",
        f"figure.edgecolor: {c('surface-000')}",
        "figure.dpi: 100  # px to pt mapping assumes 100 dpi",
        "figure.figsize: 6.4, 4.0",
        f"figure.titlesize: {heading}  # heading",
        f"figure.titleweight: {weight}",
        "savefig.facecolor: auto",
        "savefig.dpi: 200",
        "savefig.bbox: tight",
        "",
        f"axes.facecolor: {c('surface-100')}  # surface-100",
        f"axes.edgecolor: {c('line-200')}  # line-200",
        "axes.linewidth: 1.0",
        "axes.spines.top: False",
        "axes.spines.right: False",
        "axes.grid: True",
        "axes.axisbelow: True",
        f"axes.titlesize: {heading}  # heading",
        f"axes.titleweight: {weight}",
        "axes.titlelocation: left",
        "axes.titlepad: 12",
        f"axes.titlecolor: {c('ink-900')}  # ink-900",
        f"axes.labelsize: {label}  # label",
        f"axes.labelcolor: {c('ink-700')}  # ink-700",
        "axes.labelpad: 6",
        f"axes.prop_cycle: cycler('color', [{cycle}])  # series-1..6",
        "axes.unicode_minus: False  # Korean fonts often lack U+2212",
        "",
        f"grid.color: {c('line-100')}  # line-100",
        "grid.linewidth: 1.0",
        "grid.alpha: 1.0",
        "",
        f"text.color: {c('ink-900')}  # ink-900",
        f"xtick.color: {c('ink-500')}  # ink-500",
        f"ytick.color: {c('ink-500')}",
        f"xtick.labelsize: {label}",
        f"ytick.labelsize: {label}",
        "xtick.major.size: 0",
        "ytick.major.size: 0",
        "xtick.minor.size: 0",
        "ytick.minor.size: 0",
        "xtick.major.pad: 6",
        "ytick.major.pad: 6",
        "",
        "legend.frameon: False",
        f"legend.fontsize: {label}",
        f"legend.title_fontsize: {label}",
        f"legend.labelcolor: {c('ink-700')}  # ink-700",
        "",
        "lines.linewidth: 2.0",
        "lines.markersize: 5",
        "lines.solid_capstyle: round",
        "lines.dash_capstyle: round",
        "patch.linewidth: 0",
        f"patch.facecolor: {c('series-1')}",
        "scatter.edgecolors: face",
        f"image.cmap: {'Blues' if theme == 'light' else 'Blues_r'}",
        "",
        "font.family: sans-serif",
        f"font.sans-serif: {', '.join(sans)}",
        f"font.monospace: {', '.join(mono)}",
        f"font.size: {body}  # body",
        "mathtext.fontset: dejavusans",
        "",
    ]
    return "\n".join(lines)


def build() -> list[Path]:
    """epoch-light.mplstyle, epoch-dark.mplstyle을 다시 씁니다."""
    out = []
    for theme in THEMES:
        path = HERE / f"epoch-{theme}.mplstyle"
        path.write_text(style_text(theme), encoding="utf-8")
        out.append(path)
    return out


_current_theme = "light"


def use(theme: str = "light", fonts_dir: str | Path | None = None) -> None:
    """스타일을 적용합니다. seaborn의 set_theme()을 쓴다면 그 다음에 부르세요."""
    global _current_theme
    if theme not in THEMES:
        raise ValueError(f"theme은 {THEMES} 중 하나입니다.")
    _current_theme = theme
    import matplotlib as mpl
    import matplotlib.pyplot as plt
    from matplotlib import font_manager

    if fonts_dir:
        for f in Path(fonts_dir).glob("*.[ot]tf"):
            font_manager.fontManager.addfont(str(f))
    plt.style.use(str(HERE / f"epoch-{theme}.mplstyle"))

    # 설치된 글꼴만 남겨 'findfont' 경고가 줄줄이 찍히지 않게 합니다.
    installed = {f.name for f in font_manager.fontManager.ttflist}
    for key in ("font.sans-serif", "font.monospace"):
        found = [n for n in mpl.rcParams[key] if n in installed]
        if found:
            mpl.rcParams[key] = found
    # 'epoch', 'epoch_r' 색상표를 등록하고 기본값으로 둡니다. seaborn heatmap에는 cmap="epoch"를 넘깁니다.
    seq = cmap(theme)
    with warnings.catch_warnings():  # 테마를 바꿔 다시 부를 때의 덮어쓰기 경고는 의도된 것입니다.
        warnings.simplefilter("ignore")
        mpl.colormaps.register(seq, name="epoch", force=True)
        mpl.colormaps.register(seq.reversed(), name="epoch_r", force=True)
    mpl.rcParams["image.cmap"] = "epoch"
    try:
        import seaborn as sns
        sns.set_palette(palette(theme))
    except ImportError:
        pass


if __name__ == "__main__":
    for p in build():
        print(f"wrote {p.relative_to(HERE.parent.parent) if HERE.parent.parent in p.parents else p}")
