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

## 13~15/08/19
#### Sequelize 도입하기
Node.js ORM 모듈 Sequelize 도입을 위해 npm을 이용하여 sequelize와 sequelize-cli를 설치하였다.
그러나 SSH로 Sequelize의 DB 연결을 설정하는 방법을 찾지 못했기 때문에 일단 ORM 도입은 보류하기로 결정했다.
해결책은 다음과 같이 두 가지이다:
* Sequelize를 SSH로 연결하는 방법을 찾기
* MSE DB를 SSH 뿐만 아니라 Standard로도 provide하도록 바꾸기
### 참고한 페이지
* https://medium.com/infocentric/setup-a-rest-api-with-sequelize-and-express-js-fae06d08c0a7

## 20/08/19
#### module/user.js : createUser 메소드로 유저 sign in 과정 모듈화
async.waterfall을 다시 이용해 (1) password hashing (2) db querying 두 단계를 수행하는 createUser 함수로 모듈화.
그러나 이런 모듈화가 꼭 필요한 것인지 재고할 필요 있어보임: register / deregister 등의 기능이 둘 이상의 상황에서 발생할 가능성이 낮아보임.

## 22/08/19
#### To-do list
* dbMethods 모듈 이름 변경: postMethods 정도..? 좀더 명확한 네이밍이 필요하다
* 게시판마다 새 게시글 올리는 POST API 설계: 파라미터를 선택할 수 있는 하나의 함수로 모듈화할 수 없을까?