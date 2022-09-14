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
    let layer = new LayerNameSystem();

    // NanumGothic.ttf
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

            // 1번째 페이지에 텍스트 그리기
            firstPage.drawText(`${charToUnicode(file.name)}`, {
                x: 20,
                y: height - 40,
                size: 20,
                font: NanumGothic,
                color: rgb(0.95, 0.1, 0.1),
                rotate: degrees(0),
            });

            // PDFDocument를 바이트(Uint8Array)로 직렬화
            const pdfBytes = await pdfDoc.save();

            // 변경된 PDF 문서를 다운로드
            download(pdfBytes, `_${file.name}`, "application/pdf");
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

// 레이어 시스템 클래스
class LayerNameSystem {
    constructor() {
        let bExtendedLayer = false;     // 확장 레이어(true), 기본 레이어(false)

        // 1. 공사 구분 (필수)
        let code_name = [];     // 코드 이름
        let code_desc = [];     // 코드 설명

        // 2. 동 구분 (필수)
        let dong_name = [];     // 동 이름
        let dong_desc = [];     // 동 설명

        // 3. 층 구분 (필수)
        let floor_name = [];    // 층 이름
        let floor_desc = [];    // 층 설명

        // 4. 타설번호 (필수)
        let cast_name = [];

        // 5. CJ 구간 (필수)
        let CJ_name = [];

        // 6. CJ 속 시공순서 (필수)
        let orderInCJ_name = [];

        // 7. 부재 구분 (필수)
        let obj_name = [];      // 부재 이름
        let obj_desc = [];      // 부재 설명
        let obj_cat = [];       // 부재 카테고리

        // 8. 제작처 구분 (선택)
        let productSite_name = [];

        // 9. 제작 번호 (선택)
        let productNum_name = [];

        // 여기서부터는 파일을 읽어옴
        const selectedFiles = csvButton.files;

        if(selectedFiles.length == 0)
            return;

        let file = selectedFiles[0];
        let reader = new FileReader();

        reader.onload = function(ev) {
            const file = ev.target.result;
            const allLines = file.split(/\r\n|\n/);
            allLines.forEach((line) => {
                //console.log(line);
            })
        }

        reader.readAsText(file, "euc-kr");
    }
}