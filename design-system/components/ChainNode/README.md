LangChain 체인의 노드 하나를 종류 배지, 이름, 메타 한 줄, 양쪽 포트로 그리는 카드입니다. 폭은 `node-width`로 고정되고, 데이터는 왼쪽 포트로 들어와 오른쪽 포트로 나갑니다.

## 종류(kind)와 배지 색

- `prompt` 프롬프트, `parser` 파서, `memory` 메모리: 중립(`surface-300` / `ink-700`).
- `llm` LLM: `primary-soft` / `primary`.
- `tool` 도구: `warning-soft` / `warning`.
- `retriever` 리트리버: `success-soft` / `success`.

색은 종류를 거들 뿐이고 배지의 단어가 종류를 말합니다.

## 소비자가 제공하는 것

- `kind`, `name`(필수). `name`은 체인 코드의 변수나 단계 이름("rag_prompt", "FAISS 리트리버").
- `meta`: 모델 ID, `k=4`, `temperature=0.2`처럼 코드가 쓰는 값 한 줄. 넘치면 말줄임표.
- `status`: 실행 추적 중의 상태. 머리글 오른쪽에 점과 단어로.
- `selected`와 `onSelect`: 선택은 한 번에 하나.
- `input: false` / `output: false`: 체인의 시작과 끝 노드에서 포트를 감춥니다.

## 잇기

`Epoch.chain([nodeProps, ...])`가 노드를 한 줄로 놓고 사이에 `Epoch.chainEdge()`(2px `line-300`, 화살촉 하나)를 끼웁니다. 분기가 있는 체인은 소비자가 노드를 배치하고 엣지를 직접 긋습니다.

## 하기 / 하지 않기

- 노드 안에 입력 필드를 넣지 않습니다. 속성은 옆 패널의 ParamField로.
- 노드 사이 간격은 최소 `space-5`. 엣지가 노드 뒤로 지나가게 두지 않습니다.
