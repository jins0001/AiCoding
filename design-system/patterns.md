# 화면 패턴

네 가지 화면이 반복됩니다. 각 패턴은 어떤 컴포넌트를 어떤 순서로 놓는지, 어떤 토큰이 경계를 긋는지 정합니다.

## 학습 실행 페이지

파인튜닝이나 분류 모델 학습 한 번(run)을 지켜보는 화면입니다.

1. 상단: `display`로 실행 이름(`파인튜닝 실행 #42`), 그 옆에 StatusChip, 오른쪽 끝에 주 동작 하나(`실행 중지`는 `danger`, 끝난 실행이면 `다시 실행`이 `primary`).
2. 지표 줄: MetricTile 넷까지 `space-3` 그리드. 순서는 손실, 정확도, 학습률, 자원(GPU 메모리). 손실의 하락은 `deltaTone: 'good'`으로 소비자가 판단해 넘깁니다.
3. 진행: EpochProgress 하나. `title`은 비워 두고 기본 `Epoch n / N`을 씁니다.
4. 로그: LogConsole, `height` 240 이상. 실행 중이면 `follow`를 켠 채 둡니다.
5. 설정 요약: ParamField를 `disabled`로 두어 이번 실행의 값을 그대로 보여 줍니다. 값은 편집할 수 없다는 뜻이 `ink-300` 글자로 전해집니다.

## 체인 캔버스

LangChain 체인을 조립하는 화면입니다.

- 왼쪽 `sidebar`에 노드 팔레트(종류별 ChainNode의 `kind` 배지 색 그대로), 오른쪽 본문이 캔버스. 캔버스 바탕은 `surface-000`, 노드는 `surface-100`.
- 데이터는 왼쪽에서 오른쪽으로. 한 줄에 들어가면 `Epoch.chain([...])`으로, 분기가 있으면 노드를 직접 배치하고 `Epoch.chainEdge()`를 잇습니다.
- 선택된 노드는 `selected`로 `primary` 테두리와 `shadow-2`. 한 번에 하나만 선택됩니다.
- 노드의 `meta`는 모델 ID, `k`, `temperature`처럼 코드가 쓰는 값 한 줄. 두 줄이 필요하면 노드가 아니라 우측 속성 패널에 ParamField로 풀어 씁니다.
- 실행 추적 중에는 각 노드의 `status`가 바뀝니다. 실패한 노드에서 멈추고, 그 노드의 로그를 아래 LogConsole에 띄웁니다.

## 평가 리포트

학습이 끝난 뒤 분류 보고서와 모델 비교를 읽는 화면입니다.

- 제목은 `title`("분류 보고서"), 그 아래 DataTable. 첫 열(`rowHeader`)은 클래스 이름이나 모델 이름, 나머지는 `align: 'num'`에 `digits: 4`.
- 비교표에서 가장 좋은 값은 `highlightMax`로 `primary` 글자. 색 외에 500 굵기로도 구별됩니다.
- 표 아래 `caption`으로 데이터 출처와 분할(`test_size=0.2, random_state=42`)을 mono로 적습니다.
- 혼동 행렬은 DataTable로 그리되 셀 바탕을 칠하지 않습니다. 값의 크기는 숫자가 말합니다.

## 노트북과 프롬프트 에디터

코드 셀과 프롬프트 템플릿을 나란히 다루는 화면입니다.

- CodeCell을 `space-3` 간격으로 세로로 쌓습니다. 실행 중인 셀은 `status: 'running'`으로 거터가 `In [*]:`이 되고 `primary` 색을 띱니다.
- 프롬프트 템플릿은 `kind: 'prompt'`. `{context}`, `{question}` 같은 변수는 `highlight` 바탕으로 자동 강조되고, 변수 목록은 셀 아래 ParamField로 채웁니다.
- 셀 위의 `title`은 파일이나 단계 이름("1. 데이터 준비"), `lang`은 `python` 또는 `jinja2`처럼 소문자 식별자.
- 출력이 오류면 `status: 'error'`로 `danger` 글자. 성공 출력은 `ink-700`.
