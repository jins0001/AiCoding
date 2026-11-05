분류 보고서나 모델 비교처럼 숫자 열이 많은 표입니다. 숫자 열은 오른쪽 정렬의 mono에 `tabular-nums`로 자릿수가 맞고, 첫 열은 행 머리글로 둘 수 있습니다.

## 사용할 때

- `classification_report`의 precision, recall, f1-score, support.
- 여러 모델의 정확도 비교(`cross_val_score` 결과 포함).
- 체크포인트 목록, 실행 목록.

## 소비자가 제공하는 것

- `columns`: `{ key, label, align, rowHeader, digits, highlightMax, format }`. 숫자 열은 `align: 'num'`과 `digits`(보통 4). 첫 열이 이름이면 `rowHeader: true`.
- `rows`: 키-값 객체 배열. 값이 DOM 노드면 그대로 들어가므로 StatusChip을 셀에 넣을 수 있습니다.
- `caption`: 표 제목. `footer`: 합계나 평균 한 행(`macro avg`).
- `highlightMax`: 그 열의 최댓값을 `primary` 글자와 500 굵기로. 손실처럼 낮을수록 좋은 열에는 쓰지 않습니다.

## 하기 / 하지 않기

- 셀 바탕을 값에 따라 칠하지 않습니다. 혼동 행렬도 숫자만.
- 행 수가 많으면 표 밖에서 페이지를 나눕니다. 표 안에서 스크롤시키지 않습니다.
- 열 머리글은 코드의 이름 그대로(`precision`, `f1-score`)거나 한국어 명사 하나. 둘을 섞지 않습니다.
