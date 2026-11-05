Epoch는 AI 모델 개발 도구를 위한 디자인 시스템입니다. 파인튜닝 실행을 띄우고 지켜보는 대시보드, LangChain 체인을 조립하는 캔버스, 노트북처럼 코드와 프롬프트를 다루는 에디터, 평가 결과를 읽는 리포트가 이 시스템이 그리는 화면입니다. 값은 모두 `tokens.json`에 있고, 컴포넌트는 `components/bundle.js`가 `window.Epoch`로 내보냅니다. 로고나 마크는 없습니다. 제품 이름은 `display` 스타일의 평문으로 씁니다.

## 원칙

- **숫자가 주인공입니다.** 정확도, 손실, 학습률, 스텝 수는 언제나 mono 계열(`metric`, `code-sm`, `log`)로, `tabular-nums`로 자릿수를 맞춰 세로로 비교되게 둡니다.
- **상태는 색만으로 말하지 않습니다.** 실행 상태는 단어(대기, 실행 중, 완료, 실패, 중지, 초안)와 함께, 완료와 실패에는 글리프(✓, ✕)를 더합니다. `success`와 `danger`는 초록과 빨강이지만 혼자 쓰이는 일이 없습니다.
- **경계는 선으로, 그림자는 떠 있는 것에만.** 카드와 셀은 `line-100` 1px, 입력과 엣지는 `line-300`. `shadow-1`은 체인 노드, `shadow-2`는 메뉴와 선택된 노드에만.
- **움직임은 데이터가 바뀔 때만.** 실행 중 점의 맥동과 버튼 스피너가 전부이고, `prefers-reduced-motion`에서는 둘 다 멈춥니다.
- **한국어 문장, 영문 식별자.** UI 문장은 한국어, 코드가 쓰는 이름(`learning_rate`, `epoch`, `batch_size`, LoRA rank)은 번역하지 않고 mono로 그대로 둡니다.

## 콘텐츠

- **어조.** 짧은 평서문, "~합니다" 체. 느낌표와 이모지는 쓰지 않습니다. 기준이 되는 문장은 저장소의 노트북이 실제로 출력하는 것들입니다: "모델이 model.pkl로 저장되었습니다.", "CUDA를 사용할 수 없습니다.", "GPU 사용 가능, CPU 사용".
- **라벨과 값.** 라벨, 콜론, 한 칸, 값. `정확도: 0.9667`, `분류 보고서:`, `예측된 품종: setosa`. 라벨은 `label` 또는 `body-strong`, 값은 mono.
- **식별자.** 한국어 라벨 옆에 코드가 쓰는 이름을 같이 보여 줍니다(ParamField의 `label`/`name` 쌍: 학습률 `learning_rate`). 용어의 영문 병기는 처음 한 번만, 괄호 안에.
- **수치 형식.** 손실과 정확도는 소수 4자리(`0.0821`, `0.9667`), 백분율은 소수 1자리(`96.7%`), 학습률은 지수 표기(`1e-4`), 시간은 `hh:mm:ss`, 메모리는 `11.2 GB`처럼 단위 앞에 한 칸.
- **상태 어휘.** 실행(run)의 상태는 여섯 가지뿐이고 칩, 로그, 노드, 표에서 같은 단어를 씁니다: queued 대기, running 실행 중, succeeded 완료, failed 실패, stopped 중지, draft 초안.
- **오류 문구.** 무엇이 실패했는지, 다음에 무엇을 하는지 두 문장. "CUDA를 사용할 수 없습니다. CPU로 계속하려면 device를 cpu로 바꾸세요."
- **빈 상태.** 한 문장과 주 동작 하나. "아직 실행이 없습니다." 다음에 `학습 시작` 버튼.

## 색

두 테마(`light`, `dark`)가 같은 토큰 이름을 공유합니다. 리터럴 흰색이나 검정은 쓰지 않습니다. 다크 테마에서 `primary`가 밝아지므로 그 위의 글자는 항상 `on-primary`입니다.

- **면.** `surface-000` 페이지, `surface-100` 카드·셀·노드·입력, `surface-200` 코드 블록과 로그 콘솔(가라앉은 면), `surface-300` 표 머리글과 행 hover, `surface-inverse` 툴팁.
- **글.** `ink-900` 본문, `ink-700` 보조 텍스트와 머리글, `ink-500` 메타데이터·타임스탬프·주석(모든 면에서 4.5:1 이상), `ink-300`은 비활성 컨트롤에만. `surface-inverse` 위에는 `ink-inverse`.
- **선.** `line-100`과 `line-200`은 장식(카드 테두리, 행 구분, 노드 외곽). 의미를 지닌 선, 즉 입력 테두리·체인 엣지·포트는 `line-300`으로, 모든 면에서 3:1 이상입니다.
- **주 색.** `primary`는 한 화면에 주 동작 하나(학습 시작), 활성 탭, 링크, 실행 중 표시. hover는 `primary-hover`, 옅은 바탕은 `primary-soft`, 그 위의 글자는 `primary` 자신. `info`는 `primary`의 별칭입니다.
- **상태 색.** `success`/`warning`/`danger`와 각각의 `-soft`. 글자색으로 쓸 때는 `surface-000/100/200`이나 자기 `-soft` 위에서만. 상태를 채움으로 쓰지 않습니다. 칩이나 배지는 `-soft` 바탕에 상태색 글자와 단어입니다.
- **코드.** `surface-200` 위에서 `code-keyword`, `code-string`, `code-number`, `code-comment`(= `ink-500`). 노트북 거터의 `In [n]:`은 `cell-in`, `Out [n]:`은 `cell-out`. 프롬프트 템플릿의 `{변수}`와 검색 일치는 `highlight` 바탕에 `ink-900` 글자.
- **차트 계열.** `series-1`부터 `series-6`은 seaborn의 deep 팔레트 그대로입니다. 저장소의 `iris01.ipynb`가 pairplot으로 그리는 바로 그 색이고, 두 테마에서 같은 값을 씁니다. `series-2`(주황)와 `series-3`(초록)은 흰 바탕에서 3:1에 못 미치므로 2px 이상의 선과 레이블 또는 마커를 함께 씁니다.
- **포커스.** `focus-ring` 2px 실선, 바탕색 2px 간격(`outline-offset`). 모든 면에서 3:1 이상이라 별도 처리 없이 어디서나 같습니다.

## 타이포그래피

가족은 둘입니다. `sans`는 IBM Plex Sans KR(한글과 라틴이 한 가족), `mono`는 IBM Plex Mono. 둘 다 Google Fonts에서 내려받습니다. 폰트 파일은 이 시스템에 없습니다.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@400;500;600&display=swap">
```

- **Display.** `display` 40/48 페이지 제목(한 화면에 하나), `title` 24/32 패널과 대화상자 제목.
- **Text.** `heading` 18/26 섹션 제목과 노드 이름, `body` 14/22 본문, `body-strong` 14/22 버튼 라벨과 표 머리글, `caption` 12/18 보조 설명과 타임스탬프(`ink-500`), `label` 12/16 필드·지표·칩 라벨.
- **Code.** `metric` 32/36 지표 값, `code` 13/20 코드 셀과 프롬프트, `code-sm` 12/18 파라미터 값·표의 숫자 열·노드 메타, `log` 12/18 로그 한 줄.
- 수치, 식별자, 파일 경로, 모델 ID, 로그는 예외 없이 mono. 한 줄에 한국어와 식별자가 섞이면 줄높이는 sans 것을 따릅니다.
- 대문자 변환(`text-transform: uppercase`)은 쓰지 않습니다. 한국어에는 효과가 없고 식별자는 망가집니다.
- 굵기는 400, 500, 600 셋. 700은 쓰지 않습니다.

## 간격, 반경, 그림자

- 4px 격자. 컴포넌트 안쪽은 `space-1`~`space-4`(4, 8, 12, 16), 컴포넌트 사이와 섹션은 `space-5`~`space-8`(24, 32, 48, 64). 카드와 셀 안쪽 여백은 `space-4`, 카드 사이는 `space-5`, 페이지 좌우는 `space-6`.
- 반경은 작게. `radius-xs` 2px 진행 막대와 토큰 강조, `radius-sm` 4px 버튼·입력·배지, `radius-md` 6px 카드·셀·콘솔·타일, `radius-lg` 10px 체인 노드와 대화상자, `radius-pill`은 상태 칩과 포트에만.
- 컨트롤 높이는 `control-sm` 28, `control-md` 32, `control-lg` 40. 고정 폭은 `gutter` 64(노트북 거터), `node-width` 220(체인 노드), `sidebar` 256.
- `shadow-1`은 체인 노드와 드래그 중인 카드, `shadow-2`는 메뉴·팝오버·선택된 노드. 그 밖의 카드에는 그림자가 없습니다.

## 레이아웃

- 좌측에 `sidebar`(실행 목록, 노드 팔레트), 본문은 최대 1200px, 좌우 여백 `space-6`.
- 지표 타일은 `space-3` 간격의 그리드로 한 줄에 넷까지. 타일 다음에 진행 막대, 그 다음에 로그 콘솔 순서로 쌓습니다.
- 체인 캔버스에서 노드는 `node-width`로 폭이 고정되고, 노드 사이는 최소 `space-5`, 엣지는 2px `line-300`에 화살촉 하나. 데이터는 왼쪽에서 오른쪽으로 흐릅니다.
- 노트북 뷰는 `gutter` 폭의 거터 뒤에 셀이 오고, 셀 사이는 `space-3`.

## 상태와 동작

- 주 동작 버튼(`primary`)은 화면에 하나. 보조 동작은 `secondary`, 인라인 동작은 `ghost`, 실행 중지와 체크포인트 삭제처럼 되돌릴 수 없는 동작은 `danger`에 확인 단계를 둡니다.
- 비활성은 `ink-300` 글자에 `surface-300` 바탕. 비활성 이유는 가까운 `caption`으로 설명합니다.
- 로딩 중인 버튼은 라벨을 유지한 채 스피너만 더합니다. 라벨을 "로딩 중..."으로 바꾸지 않습니다.
- 입력 오류는 `danger` 테두리와 `danger` 글자의 설명 한 줄. 색만 바꾸지 않습니다.

## 아이콘

저장소에 아이콘 세트가 없어 이 시스템은 아이콘 없이 설계했습니다. 필요한 표식은 mono 글리프 넷으로 충분합니다: ▶ 시작, ■ 중지, ✓ 완료, ✕ 실패, 그리고 셀렉트의 ▾. 글리프는 항상 단어 옆에 섭니다. 아이콘 세트를 들인다면 Lucide(1.5px 스트로크, `currentColor`)를 16px로, 라벨과 함께 쓰는 것을 권합니다. 이모지는 UI에 쓰지 않습니다.

## 데이터 시각화

- 계열 순서는 `series-1`부터. 지표 하나에 계열 하나: 정확도는 `series-1`, 손실은 `series-2`. 같은 지표의 학습 곡선은 실선, 검증 곡선은 점선으로 같은 계열색을 씁니다.
- 축 라벨과 눈금은 `caption`에 `ink-500`, 격자선은 `line-100`. 차트 바탕은 `surface-100`.
- 값 레이블은 mono. 손실 축은 0부터 시작하지 않아도 되지만 정확도 축은 0~1로 고정합니다.
- 스파크라인은 MetricTile의 `series`로 그리며 축 없이 추세만 보여 줍니다.
- 노트북의 matplotlib와 seaborn 차트는 `python/epoch_theme.py`로 같은 값을 씁니다. 첫 셀에서 `epoch_theme.use()`를 부르면 바탕, 격자, 글꼴, 계열 색, 색상표가 이 시스템을 따릅니다. 자세한 규칙은 노트북 차트 섹션에 있습니다.

## 컴포넌트

아홉 개가 있고 모두 `window.Epoch`의 함수입니다. props 객체를 받아 HTMLElement를 돌려주므로 `container.appendChild(Epoch.Button({...}))`처럼 씁니다. 프레임워크는 필요 없습니다. 소비자는 데이터(값, 줄, 행, 노드 목록)와 서식(소수 자릿수, 단위)을 제공하고, 컴포넌트는 그리기만 합니다.

- **Button.** 동작 하나. `label`은 한국어 동사구("학습 시작").
- **StatusChip.** 실행 상태 여섯 가지 중 하나를 단어와 글리프로.
- **MetricTile.** 지표 하나: 라벨, `metric` 값, 단위, 증감, 스파크라인.
- **EpochProgress.** 에포크와 스텝 진행. 에포크 수만큼 칸이 나뉩니다.
- **LogConsole.** 타임스탬프, 레벨, 메시지의 로그 줄.
- **ChainNode.** LangChain 체인의 노드 하나. `Epoch.chain([...])`이 노드를 엣지로 이어 줍니다.
- **CodeCell.** 노트북 셀. `kind: 'prompt'`면 템플릿의 `{변수}`를 강조합니다.
- **ParamField.** 하이퍼파라미터 입력. 한국어 라벨과 코드 이름을 같이 보여 줍니다.
- **DataTable.** 분류 보고서처럼 숫자 열이 많은 표.

React 앱에서는 컴포넌트를 ref에 붙이는 얇은 래퍼 하나로 씁니다. 페이지에는 `tokens.css`, `components/bundle.css`, `components/bundle.js`를 먼저 넣습니다.

```jsx
function EpochMount({ name, ...props }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    ref.current.replaceChildren(window.Epoch[name](props));
  });
  return <div ref={ref} />;
}

<EpochMount name="MetricTile" label="검증 정확도" value="0.9667" delta="+0.0333" deltaTone="good" />
```

이 저장소에는 UI 코드가 없으므로 아홉 컴포넌트는 모두 의도적으로 새로 정의한 것입니다. 노트북이 출력하는 것(정확도, 분류 보고서, 학습 루프의 epoch/loss, 모델 저장 메시지, GPU 확인 로그)을 화면에 올리는 데 필요한 최소한으로 골랐습니다.
