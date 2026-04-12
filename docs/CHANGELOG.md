# ソウル交通ナビ 개발 변경 이력 (Development Changelog)

이 문서는 seoul-transit-navi 프로젝트의 모든 개발 작업 내역을 기록합니다. 본 프로젝트는 일본인 관광객을 위한 서울 지하철 내비게이션 서비스로, Cloudflare Workers 인프라를 기반으로 구축되었습니다.

## [최근 작업] 인프라 및 배포 최적화 (2026-04-12)
*   **OpenNext 및 Next.js 업그레이드 (Commit: 5cf6ff3)**
    *   `@opennextjs/cloudflare` 버전을 1.3.0에서 1.19.1로 업그레이드
    *   `next` 버전을 15.5.14에서 15.5.15로 업그레이드
    *   `wrangler` 버전을 3.x에서 4.x로 업그레이드하여 배포 안정성 확보
    *   `instrumentation.ts` 워커 환경 호환성 수정 및 `output: standalone` 설정 제거
    *   `compatibility_date`를 2025-04-01로 업데이트

## [v0.1.0] MVP 기능 완성 및 품질 개선 (2026-04-11)
*   **코드 품질 개선 및 이슈 해결 (Oracle VERIFIED)**
    *   **이슈 #32, #33, #35 해결 (Commit: 11df488)**: MVP 문서 구조 재정의, 구조화된 API 로깅 도입, 환승 0분 표시 오류 수정
    *   **이슈 #36-#53 해결 (Commit: 6c023af)**: Oracle 리뷰를 통한 18개의 코드 품질 및 안정성 개선 항목 반영
    *   **이슈 #26-#35 해결 (Commit: 9233aec)**: RouteStep 구조화, 에러 핸들링 중앙화, KV 캐시 정책(90일) 설정, CORS 환경변수 지원 등 반영

*   **주요 기능 구현 (MVP)**
    *   **경로 검색 시스템**: ODsay API 연동 및 Dijkstra 기반 그래프 폴백 알고리즘 구현
    *   **검색 및 가이드**: 다국어 별칭 기반 역 검색, 15개 주요 관광지 상세 페이지, 공항-호텔 길찾기 플로우
    *   **콘텐츠 제공**: 4개 주요 지역 가이드, 혼동하기 쉬운 역 가이드, 일본인 전용 교통 팁 페이지
    *   **UI/UX**: JR 스타일 인터랙티브 지하철 노선도, 공유 가능한 경로 URL (90일 TTL), 다국어(일어/한국어) 지원

## [초기 개발] 인프라 구축 및 기본 기능 (2025-12 ~ 2026-03)
*   **인프라 및 데이터 레이어**
    *   Cloudflare Workers (Hono) API 서버 구축
    *   Cloudflare D1 데이터베이스 연동 (111개 역, 12개 노선 데이터 적재)
    *   Cloudflare KV를 활용한 경로 검색 결과 캐싱 시스템 구현
    *   CORS 설정 및 API 보안 구성

*   **핵심 데이터 처리**
    *   역명 다국어 표기 데이터 인출 및 가공
    *   일본어 단계별 경로 설명 생성 로직 구현
    *   출구 및 환승 정보 데이터 fixture 구축

## 배포 정보
*   **API 서버**: [https://seoul-transit-navi-api.yeongseon-choe.workers.dev](https://seoul-transit-navi-api.yeongseon-choe.workers.dev)
*   **웹 서비스**: [https://seoul-transit-navi-web.yeongseon-choe.workers.dev](https://seoul-transit-navi-web.yeongseon-choe.workers.dev)

---
*모든 변경 사항은 Oracle에 의해 검증되었으며, MVP 스코프 내에서 정상 작동함을 확인했습니다.*
