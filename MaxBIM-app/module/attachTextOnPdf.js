// 출처
// https://pdf-lib.js.org/
// https://jsfiddle.net/Hopding/64zajhge/1/

const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;

const fileButton = document.getElementById("file");
const saveButton = document.getElementById("save");
const csvButton = document.getElementById("csv");

saveButton.addEventListener("click", savePDF);

// PDF 파일 저장하기
async function savePDF() {
    const selectedFiles = fileButton.files;

    if(selectedFiles.length == 0) {
        alert ("PDF 파일 선택은 필수입니다.");
        return;
    }

    // 레이어 체계에 대한 정의를 가져옴
    // 1. 공사 구분 (필수)
    code_name = [];     // 코드 이름
    code_desc = [];     // 코드 설명

    // 2. 동 구분 (필수)
    dong_name = [];     // 동 이름
    dong_desc = [];     // 동 설명

    // 3. 층 구분 (필수)
    floor_name = [];    // 층 이름
    floor_desc = [];    // 층 설명

    // 4. 타설번호 (필수)
    cast_name = [];

    // 5. CJ 구간 (필수)
    CJ_name = [];

    // 6. CJ 속 시공순서 (필수)
    orderInCJ_name = [];

    // 7. 부재 구분 (필수)
    obj_name = [];      // 부재 이름
    obj_desc = [];      // 부재 설명
    obj_cat = [];       // 부재 카테고리

    // 8. 제작처 구분 (선택)
    productSite_name = [];

    // 9. 제작 번호 (선택)
    productNum_name = [];
    
    // 레이어 체계 정보 가져오기
    loadLayerInfo();

    for(const file of selectedFiles) {
        if (file.type == "application/pdf") {
            // 기존 PDF 파일 가져오기
            const fileUrl = (`C:\\${file.name}`);
            const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());

            // 기존 PDF 파일로부터 PDFDocument를 로드함
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            const fontUrl = 'NanumGothic.ttf';
            const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
            pdfDoc.registerFontkit(fontkit);
            const NanumGothic = await pdfDoc.embedFont(fontBytes);

            // 문서의 1번째 페이지 가져옴
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            // 1번째 페이지의 너비/높이 가져옴
            const { width, height } = firstPage.getSize();

            // 1번째 페이지에 텍스트 그리기 (파일명)
            firstPage.drawText(`${charToUnicode(file.name)}`, {
                x: 20,
                y: height - 20,
                size: 15,
                font: NanumGothic,
                color: rgb(0.95, 0.1, 0.1),
                rotate: degrees(0),
            });

            // 1번째 페이지에 텍스트 그리기 (레이어 이름에 대한 설명)
            let secondText = '';
            const filenameText = `${file.name}`.split('-').filter((element) => element !== '');     // '-' 문자 기준으로 나누고 공백 문자열은 제거
            for(let xx = 0 ; xx < filenameText.length ; ++xx) {
                filenameText[xx] = filenameText[xx].trim();
            }

            // 숫자 문자열이 나오는 인덱스를 처음 찾으면 바로 뒤의 문자열과 합침 ('01' + 'S' --> '01-S') 공사 구분 코드를 완성하기 위함
            for(let xx = 0 ; xx < filenameText.length ; ++xx) {
                if(isNaN(filenameText[xx]) === false) {
                    filenameText[xx+1] = `${filenameText[xx]}-${filenameText[xx+1]}`
                    break;
                }
            }

            let firstIndex = -1;    // 공사 구분 코드가 발견되는 인덱스를 찾음

            for(let xx = 0 ; xx < filenameText.length ; ++xx) {
                for(let yy = 0 ; yy < code_name.length ; ++yy) {
                    if(filenameText[xx] === code_name[yy]) {
                        firstIndex = xx;
                        break;
                    }
                }
            }

            if(firstIndex !== -1) {
                // 공사 구분
                for(xx = 0 ; xx < code_name.length ; ++xx) {
                    if(filenameText[firstIndex] === code_name[xx]) {
                        secondText += `${code_desc[xx]} `;
                        break;
                    }
                }

                // 동
                for(xx = 0 ; xx < dong_name.length ; ++xx) {
                    if(filenameText[firstIndex+1] === dong_name[xx]) {
                        secondText += `[${dong_desc[xx]}]동 `;
                        break;
                    }
                }

                // 층
                for(xx = 0 ; xx < floor_name.length ; ++xx) {
                    if(filenameText[firstIndex+2] === floor_name[xx]) {
                        secondText += `${floor_desc[xx]} `;
                        break;
                    }
                }

                // 타설번호
                for(xx = 0 ; xx < cast_name.length ; ++xx) {
                    if(filenameText[firstIndex+3] === cast_name[xx]) {
                        secondText += `타설번호[${cast_name[xx]}] `;
                    }
                }

                // CJ구간
                for(xx = 0 ; xx < CJ_name.length ; ++xx) {
                    if(filenameText[firstIndex+4] === CJ_name[xx]) {
                        secondText += `CJ[${CJ_name[xx]}] `;
                    }
                }

                // CJ 속 시공순서
                for(xx = 0 ; xx < orderInCJ_name.length ; ++xx) {
                    if(filenameText[firstIndex+5] === orderInCJ_name[xx]) {
                        secondText += `시공순서[${orderInCJ_name[xx]}] `;
                    }
                }

                // 부재 이름
                for(xx = 0 ; xx < obj_name.length ; ++xx) {
                    if(filenameText[firstIndex+6] === obj_name[xx]) {
                        secondText += `${obj_desc[xx]} `;
                    }
                }

                // 제작처 구분
                for(xx = 0 ; xx < productSite_name.length ; ++xx) {
                    if(filenameText[firstIndex+7] === productSite_name[xx]) {
                        secondText += `제작처[${productSite_name[xx]}] `;
                    }
                }

                // 제작 번호
                for(xx = 0 ; xx < productNum_name.length ; ++xx) {
                    if(filenameText[firstIndex+8] === productNum_name[xx]) {
                        secondText += `제작번호[${productNum_name[xx]}]`;
                    }
                }

                firstPage.drawText(`${charToUnicode(secondText)}`, {
                    x: 20,
                    y: height - 40,
                    size: 15,
                    font: NanumGothic,
                    color: rgb(0.95, 0.1, 0.1),
                    rotate: degrees(0),
                });
            }

            // PDFDocument를 바이트(Uint8Array)로 직렬화
            const pdfBytes = await pdfDoc.save();

            // 변경된 PDF 문서를 다운로드
            //download(pdfBytes, `_${file.name}`, "application/octet-stream");
            downloadFile(pdfBytes, `_${file.name}`);
        }
    }
}

// 문자열 Ansi -> Unicode로 변환
function charToUnicode(str) {
    if(!str)   return false;
    let unicode = '';
    for(let i = 0, l = str.length ; i < l ; i++) {
        n = str[i].charCodeAt(0);

        unicode += str[i];
    }

    return unicode;
}

// 다운로드 함수
function downloadFile(bytes, filename) {
    const blob = new Blob([bytes], {type: 'application/octet-stream'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}`;
    a.click();
    a.remove();
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 0)
}

// 레이어 체계 정보 가져오기
function loadLayerInfo() {
    const selectedFiles = csvButton.files;

    if(selectedFiles.length == 0)
        return;

    let file = selectedFiles[0];
    let reader = new FileReader();

    reader.onload = function(ev) {
        const file = ev.target.result;
        const allLines = file.split(/\r\n|\n/);
        let i = 1;
        for(let xx = 0 ; xx < allLines.length ; ++xx) {
            const line = allLines[xx];
            const items = line.split(',').filter((element) => element !== '');      // ',' 문자 기준으로 나누고 공백 문자열은 제거

            if(i == 1)  for(let yy = 1 ; yy < items.length ; ++yy)  code_name.push(items[yy]);         // 공사 구분
            if(i == 2)  for(let yy = 1 ; yy < items.length ; ++yy)  code_desc.push(items[yy]);         // 공사 구분 설명
            if(i == 3) {                                                                               // 동 이름 (숫자이면 4자리로 맞춤)
                for(let yy = 1 ; yy < items.length ; ++yy) {
                    if(isNaN(items[yy]) === false)
                        items[yy] = items[yy].padStart(4, '0');
                    dong_name.push(items[yy]);
                }
            }
            if(i == 4)  for(let yy = 1 ; yy < items.length ; ++yy)  dong_desc.push(items[yy]);         // 동 설명
            if(i == 5)  for(let yy = 1 ; yy < items.length ; ++yy)  floor_name.push(items[yy]);        // 층 이름
            if(i == 6)  for(let yy = 1 ; yy < items.length ; ++yy)  floor_desc.push(items[yy]);        // 층 설명
            if(i == 7) {                                                                               // 타설번호 (숫자이면 2자리로 맞춤)
                for(let yy = 1 ; yy < items.length ; ++yy) {
                    if(isNaN(items[yy]) === false)
                        items[yy] = items[yy].padStart(2, '0');
                    cast_name.push(items[yy]);
                }
            }
            if(i == 8) {                                                                               // CJ (숫자이면 2자리로 맞춤)
                for(let yy = 1 ; yy < items.length ; ++yy) {
                    if(isNaN(items[yy]) === false)
                        items[yy] = items[yy].padStart(2, '0');
                    CJ_name.push(items[yy]);
                }
            }
            if(i == 9) {                                                                               // CJ 속 시공순서 (숫자이면 2자리로 맞춤)
                for(let yy = 1 ; yy < items.length ; ++yy) {
                    if(isNaN(items[yy]) === false)
                        items[yy] = items[yy].padStart(2, '0');
                    orderInCJ_name.push(items[yy]);
                }
            }
            if(i == 10) for(let yy = 1 ; yy < items.length ; ++yy)  obj_name.push(items[yy]);          // 부재
            if(i == 11) for(let yy = 1 ; yy < items.length ; ++yy)  obj_desc.push(items[yy]);          // 부재 설명
            if(i == 12) for(let yy = 1 ; yy < items.length ; ++yy)  obj_cat.push(items[yy]);           // 부재가 속한 카테고리(공사 구분)
            if(i == 13) for(let yy = 1 ; yy < items.length ; ++yy)  productSite_name.push(items[yy]);  // 제작처 구분
            if(i == 14) {                                                                              // 제작번호 (숫자이면 3자리로 맞춤)
                for(let yy = 1 ; yy < items.length ; ++yy) {
                    if(isNaN(items[yy]) === false)
                        items[yy] = items[yy].padStart(3, '0');
                    productNum_name.push(items[yy]);
                }
            }

            i++;
        }
    }

    reader.readAsText(file, "euc-kr");
}