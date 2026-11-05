# 노트북 차트

이 저장소의 노트북은 matplotlib와 seaborn으로 그립니다. `python/epoch_theme.py`가 두 라이브러리를 같은 토큰으로 맞춥니다. 값은 모두 `tokens.json`에서 만들어지므로, 토큰을 고치면 스크립트를 다시 돌려 스타일 파일을 갱신합니다.

## 쓰는 법

```python
import sys; sys.path.append("../design-system/python")  # jupyter/ 폴더 기준
import epoch_theme

epoch_theme.use()          # 라이트. 다크는 epoch_theme.use("dark")
```

- 노트북 맨 위에서, 다른 그리기 코드보다 먼저 한 번 부릅니다. `sns.set_theme()`을 쓴다면 그 다음에 부릅니다. 나중에 부른 쪽이 이깁니다.
- 스타일 파일만 쓸 수도 있습니다: `plt.style.use("../design-system/python/epoch-light.mplstyle")`. 이 경우 `epoch` 색상표와 설치된 글꼴 정리는 빠집니다.
- 토큰을 고친 뒤에는 `python design-system/python/epoch_theme.py`가 `epoch-light.mplstyle`과 `epoch-dark.mplstyle`을 다시 씁니다. 스타일 파일은 손으로 고치지 않습니다.
- matplotlib 3.6 이상이 필요합니다. 그보다 낮으면 한글과 라틴 글꼴 사이의 글리프 대체가 되지 않습니다.

## 토큰과 matplotlib 설정

| matplotlib | 토큰 |
| --- | --- |
| 그림 바탕 `figure.facecolor` | `surface-000` |
| 축 바탕 `axes.facecolor` | `surface-100` |
| 축선 `axes.edgecolor` | `line-200` (위, 오른쪽 축선은 없음) |
| 격자 `grid.color` | `line-100` |
| 제목 | `ink-900`, `heading` 크기와 굵기, 왼쪽 정렬 |
| 축 라벨, 범례 | `ink-700`, `label` 크기 |
| 눈금 라벨 | `ink-500`, `label` 크기, 눈금선 없음 |
| 색 순환 `axes.prop_cycle` | `series-1` … `series-6` |
| 기본 글자 | `body` 크기, `sans` 가족 |
| 색상표 `image.cmap` | `epoch`: `surface-300`에서 `primary`로 |

크기는 px 토큰을 pt로 바꿔 씁니다. `figure.dpi` 100에서 1px는 0.72pt이므로 `body` 14px는 10pt, `heading` 18px는 13pt, `label` 12px는 8.5pt입니다.

## 규칙

- 지표 하나에 계열 하나: 정확도는 `series-1`, 손실은 `series-2`. 같은 지표의 학습 곡선은 실선, 검증 곡선은 점선(`ls="--"`)으로 같은 색을 씁니다. 색은 `epoch_theme.palette()[i]`나 `epoch_theme.color("series-2")`로 꺼냅니다.
- 정확도 축은 `set_ylim(0, 1)`로 고정합니다. 손실 축은 0에서 시작하지 않아도 됩니다.
- 제목은 한국어 명사구("학습 곡선", "혼동 행렬")로 씁니다. 축 라벨은 코드의 이름 그대로(`epoch`, `petal length (cm)`) 쓰거나 한국어 명사 하나로 씁니다.
- `series-2`와 `series-3`은 흰 바탕에서 3:1에 못 미칩니다. 선은 2px를 유지하고 마커(`marker="o"`)나 범례를 함께 둡니다.
- seaborn 산점도에는 `linewidth=0`을 넘겨 점의 흰 테두리를 없앱니다. 다크 테마에서는 흰 테두리가 도드라집니다.
- 혼동 행렬 그림은 `cmap="epoch"`로 그린 뒤 바로 `epoch_theme.readable_annotations(ax)`를 부릅니다. seaborn이 고르는 숫자 색은 일부 칸에서 대비가 2.3:1까지 떨어집니다. 이 함수는 칸마다 `ink-900`과 `ink-inverse` 중 대비가 높은 색으로 바꿔 4.5:1 이상을 지킵니다.

```python
ax = sns.heatmap(cm, annot=True, fmt="d", cbar=False, cmap="epoch",
                 linewidths=2, linecolor=epoch_theme.color("surface-100"))
epoch_theme.readable_annotations(ax)
ax.set_title("혼동 행렬"); ax.set_xlabel("예측"); ax.set_ylabel("정답")
```

- 앱 화면의 평가 리포트에서는 혼동 행렬을 그림이 아니라 DataTable로 보여 줍니다. 그곳에서는 칸을 칠하지 않습니다.

## 한글 글꼴

- `sans`는 IBM Plex Sans KR, Apple SD Gothic Neo, 맑은 고딕, AppleGothic, 나눔고딕, Noto Sans CJK KR, DejaVu Sans 순서로 찾습니다. `use()`는 설치된 글꼴만 남겨 `findfont` 경고가 줄줄이 찍히지 않게 합니다.
- Windows에는 맑은 고딕이 기본으로 있어 따로 할 일이 없습니다. IBM Plex Sans KR 글꼴 파일을 한 폴더에 내려받아 두었다면 `epoch_theme.use(fonts_dir="폴더")`로 설치 없이 등록합니다.
- `axes.unicode_minus`는 꺼 둡니다. 한글 글꼴에 유니코드 마이너스(U+2212)가 없으면 음수 눈금이 네모로 깨지기 때문입니다.
- 한글 글꼴이 하나도 없으면 DejaVu Sans로 떨어지고 한글이 네모로 나옵니다. 이때는 나눔고딕이나 Noto Sans CJK KR을 설치합니다.
