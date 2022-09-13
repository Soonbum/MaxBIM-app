// 출처
// https://pdf-lib.js.org/
// https://jsfiddle.net/Hopding/64zajhge/1/

const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;

const fileButton = document.getElementById("file");
const saveButton = document.getElementById("save");

saveButton.addEventListener("click", savePDF);

async function savePDF() {
    const selectedFiles = fileButton.files;

    if(selectedFiles.length == 0) {
        alert ("PDF 파일 선택은 필수입니다.");
        return;
    }

    // NanumGothic.ttf
    for(const file of selectedFiles) {
        if (file.type == "application/pdf") {
            // 기존 PDF 파일 가져오기
            //const url = (`http://127.0.0.1:8887/${file.name}`);
            const url = (`C:\\${file.name}`);
            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

            // 기존 PDF 파일로부터 PDFDocument를 로드함
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            // Courier 글꼴 포함시킴
            const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

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

function charToUnicode(str) {
    if(!str)   return false;
    let unicode = '';
    for(let i = 0, l = str.length ; i < l ; i++) {
        n = str[i].charCodeAt(0);

        unicode += str[i];
    }

    return unicode;
}