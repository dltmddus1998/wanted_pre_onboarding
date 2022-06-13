# wanted_pre_onboarding

## 🚨 요구사항

---

### 채용공고 등록

### 채용공고 수정

### 채용공고 삭제

### 채용공고 목록 조회

### 채용 상세 페이지 조회

## ✍️ 구현 과정

---

🗓 **우선 기본에 충실하여 필수 구현 요소만 구현하고, 이후 가산점 부분 구현할 계획**

### DataBase 설계하기

✔︎ **필요한 모델**

- 회사 - Corporation
    
    필드명 - **회사id(corp_id) - pk**, 회사명(corp_name), 국가(country), 지역(region)
    
- 사용자 - User
    
    필드명 - **사용자id(user_id) - pk**, 사용자이름(user_name), 
    
- 채용 공고 - Notice
    
    필드명 - **공고id(notice_id) - pk**, **회사id(corp_id) - fk**, 채용포지션(recruit_pos), 채용보상금(recruit_pay), 채용내용(recruit_content), 사용기술(tech)
    
- ~~지원 내역 (선택 사항) - History~~

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9c881b33-4054-4e2d-875a-e333d51c7f2c/Untitled.png)

<br>
<br>

### REST API 설계하기

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1ecaba56-49ba-47a1-9bbe-c5260b5807bd/Untitled.png)

<Detail>

[REST API 상세하게 보기](https://undefined-333.gitbook.io/untitled/reference/api-reference/undefined)