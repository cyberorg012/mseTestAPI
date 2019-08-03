#  Progress Report

#### 이 문서는 19년 8월 2일에 만들어졌으며, MSE Test API 개발 과정에서 어떤 기능이 추가되었고 기존 기능이 어떻게 개선되었는지에 대한 기록이 이루어질 예정이다. 세부 사항은 다음과 같다.
* Javascript 문법과 기본적인 신택스
* 문제 설명과 그에 대한 솔루션
* 기존 코드/개선된 코드의 차이점과 그에 대한 변 등

## 01/08/19
#### database.js : 테이블 이름과 id/category 등을 파라미터로 받아 가장 기본적인 select * 를 처리하는 함수 생성
### fetchDataWithID
id를 파라미터로 받아 특정 테이블에서 1개의 row를 반환하는 기능을 fetchDataWithID 함수로 모듈화하였다.
이 함수는 id와 콜백함수를 파라미터로 가지며, 내부에서는 async.waterfall 을 통해 (1) select statement로 row 가져오기 (2) update statement로 조회수 1회 증가시키기 라는 두 가지 기능을 수행한다.
콜백함수는 error와 result를 받아 프론트에 적절한 데이터를 전송한다.
### 참고한 페이지
* https://programmingsummaries.tistory.com/325
* https://proinlab.com/archives/1811

## 02/08/19