# MaxBIM-app

## JS+Electron으로 작성한 MaxBIM 업무용 보조 도구입니다.

![물량산출표 작성 프로그램](https://user-images.githubusercontent.com/16474083/204410844-a1034afe-51e3-4c5b-bb54-c85d1b5fb551.png)

물량산출표 작성 프로그램: MaxBIM 애드온(ArchiCAD 19)의 "선택한 부재 정보 내보내기 (Single 모드)" 기능과 연계해서 사용할 수 있음

![PDF에 텍스트 붙이기 프로그램](https://user-images.githubusercontent.com/16474083/204410859-f05ee92a-0273-493c-a650-592b81d008c6.png)

PDF에 텍스트 붙이기 프로그램: MaxBIM 애드온(ArchiCAD 19)의 "모든 입면도 PDF로 내보내기 (Multi 모드)" 기능과 연계해서 사용할 수 있음


# 개발 환경 구축 방법 (참조)

  - https://www.electronjs.org/docs/latest/tutorial/quick-start

  - https://cypsw.tistory.com/56
  
# 개발 환경 구축 방법 (상세)

  - Node.js 설치
  
  - Electron 설치: `npm install electron -g`
  
  - Electron 프로젝트 생성
  
  ```
  mkdir my-electron-app && cd my-electron-app
  npm init -y
  npm i --save-dev electron
  ```
  
  - 파일 구성은 다음과 같습니다.
  
    - index.html = 메인화면

    - preload.js = 사전에 로드되어야 하는 라이브러리

    - main.js = 메인화면 자바 스크립트

    - package.json = 링크 구성 (CMake 같은거)
    
  - main.js
  
  ```
  const { app, BrowserWindow } = require('electron')
  const path = require('path')

  function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    win.loadFile('index.html')
  }

  app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  ```
  
  - index.html
  
  ```
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Hello World!</title>
      <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
  </head>
  <body style="background: white;">
      <h1>Hello World!</h1>
      <p>
          We are using Node.js <span id="node-version"></span>,
          Chromium <span id="chrome-version"></span>,
          and Electron <span id="electron-version"></span>.
      </p>
  </body>
  </html>
  ```
  
  - preload.js
  
  ```
  window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })
  ```
  
  - package.json
  
  ```
  {
      "name": "my-electron-app",
      "version": "0.1.0",
      "author": "your name",
      "description": "My Electron app",
      "main": "main.js",
      "scripts": {
          "start": "electron ."
      }
  }
  ```
  
  - 실행하기: `npm start`
  
  - 실행파일 만들기: `npm install --save-dev electron-builder`
  
    설치 후 package.json을 다음과 같이 수정할 것
    
  ```
  {
    "name": "my-electron-app",
    "version": "0.1.0",
    "author": "your name",
    "description": "My Electron app",
    "main": "main.js",
    "scripts": {
        "start": "electron .",
        "deploy":"electron-builder --windows nsis:ia32"
    },

    "build": {
      "productName": "test",
      "appId": "com.electron.hello",
      "asar": true,
      "protocols": {
        "name": "test",
        "schemes": [
          "test"
        ]
      },
      "win": {
        "target": [
          "zip",
          "nsis"
        ],
        "icon": "./resources/installer/Icon.ico"
      },
      "nsis": {
        "oneClick": false,
        "allowToChangeInstallationDirectory": true
      },
      "directories": {
        "buildResources": "./resources/installer/",
        "output": "./exeResult/",
        "app": "."
      }
    }
  }
  ```
  
  - 빌드하기: `npm run deploy`
  
