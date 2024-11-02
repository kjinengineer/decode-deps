# Dep-Track

**Dep-Track**는 자바스크립트 프로젝트의 모듈 의존성을 분석하고 시각화해주는 모듈입니다. import와 require를 통해 서로 의존하고 있는 모듈을 파악하고 그래프로 작성됩니다. 사용자의 코드베이스에서 각 모듈 간의 의존성을 파악하고, 그래프 형식으로 시각화하여 더 나은 코드 구조를 위한 통찰을 제공합니다.

## Features

- **의존성 그래프 생성**: 프로젝트 내의 모듈들이 서로 어떻게 의존하고 있는지 그래프 형식으로 시각화합니다.
- **`import`와 `require` 지원**: ES모듈과 CommonJS 방식 모두를 분석합니다.
- **동적 시각화 조정**: 노드 크기 및 간격을 슬라이더로 조정하여 그래프를 다양한 형태로 관찰할 수 있습니다.
- **상세한 모듈 정보**: 각 노드에 마우스를 올리면, 모듈 크기와 같은 상세 정보를 표시해줍니다.

## Preview

Picture

## Installation

```bash
npm install dep-track
# or
yarn add dep-track
```

## How to use

모듈을 설치한 후 npx 명령어로 분석을 원하는 폴더 명을 입력하세요. 입력값은 배열 형식으로 작성해야 합니다. 예를 들어 ./src 폴더 내부의 파일들을 분석하려면 다음과 같이 입력해야 합니다.

```bash
npx dep-track '["./src"]'
```

만약 여러 폴더를 탐색하고 싶다면 다음과 같이 입력합니다.

```bash
npx dep-track '["./src", "./dist"]'
```

명령어 입력 후, 결과를 localhost:5001에서 확인할 수 있습니다.

## Contributing

기여하고 싶으신 분들은 Pull Request를 보내주시거나 이슈로 문의해 주세요. 프로젝트를 개선할 수 있는 피드백도 언제든 환영합니다!

## Docs

자세한 내용과 최신 업데이트는 Docs에서 확인하실 수 있습니다.

## License

This project is licensed under the **MIT License.**
