const fileButton = document.getElementById ("file");
const titleInput = document.getElementById ("title");
const dateInput = document.getElementById ("date");
const saveButton = document.getElementById ("save");

saveButton.addEventListener ("click", saveXLSX);

function saveXLSX () {
    // 타이틀, 날짜 정보를 가져옴
    //console.log (`제목: ${titleInput.value}, 날짜: ${dateInput.value}`);

    const selectedFiles = fileButton.files;

    if (selectedFiles.length == 0) {
        alert ("중간보고서 txt 파일 선택은 필수입니다.");
        return;
    }

    for (const file of selectedFiles) {
        if (file.type == "text/plain") {
            // ================================================== 파일명 읽어오기
            //console.log (`파일명: ${file.name}\n`);
            let excelFileName = file.name.replace (/.txt/gi, '.xlsx');
            excelFileName = excelFileName.replace (' - 선택한 부재 정보 (중간보고서)', '');
            excelFileName = excelFileName.replace (' - Graphisoft ArchiCAD-64 19', '');

            // ================================================== 텍스트 파일 읽어오기
            let textContents;
            let reader = new FileReader ();
            reader.onload = function (ev) {
                textContents = ev.target.result;    // 텍스트 파일 내용 저장

                // 엑셀 파일 생성 (SheetJS 무료 버전에서는 셀 스타일 지정은 불가함)
                let wb = XLSX.utils.book_new ();    // workbook 생성
                wb.SheetNames.push ("Sheet 1");     // 시트 생성
                
                let iBegin;
                let iEnd;
                let productName;
                let merge = [];
                let validLines;

                // 기록할 데이터는 2차원 배열로 입력하면 됨, let wsData = [[],['A1' , 'A2', 'A3'],['B1','B2','B3'],['C1','C2']];
                // 실제 기록할 데이터
                let wsData = [ [titleInput.value], [], ['','','','','','',dateInput.value], ['구간', '품목', '규격', '길이', '수량', '단위', '비고'] ];     // 헤더
                let strArr = textContents.split ('\n');
                for (let i=0 ; i < strArr.length ; i++) {
                    let smallStrArr = strArr [i].split ('|');

                    for (let j=0 ; j < smallStrArr.length ; j++) {
                        smallStrArr [j] = smallStrArr [j].trim ();
                    }

                    // 1번째 줄의 품목은 무조건 저장
                    if (i == 0) {
                        iBegin = iEnd = i;
                        productName = smallStrArr [0];
                    } else {
                        if (productName === smallStrArr [0]) {
                            iEnd = i;
                        } else {
                            // 셀 병합 정보 추가
                            merge.push ({ s: { r: iBegin + 4, c: 1 }, e: { r: iEnd + 4, c: 1 } },);     // 품목
                            merge.push ({ s: { r: iBegin + 4, c: 5 }, e: { r: iEnd + 4, c: 5 } },);     // 단위

                            iBegin = iEnd = i;
                            productName = smallStrArr [0];
                        }
                    }

                    // 비어 있는 행은 처리하지 않음
                    if (strArr [i].length > 12) {
                        wsData.push (['', smallStrArr [0], smallStrArr [1], smallStrArr [2], parseInt (smallStrArr [4]), smallStrArr [3]]);     // 수량만 숫자로 변환
                    }
                }

                // 데이터를 엑셀 파일로 저장함
                let ws = XLSX.utils.aoa_to_sheet (wsData);
                ws ["!merges"] = merge;
                wb.Sheets ["Sheet 1"] = ws;
                wb ["Sheets"]["Sheet 1"]["!cols"] = [{wpx: 40}, {wpx: 170}, {wpx: 130}, {wpx: 70}, {wpx: 70}, {wpx: 70}, {wpx: 70}];    // 열 너비 지정
                let wbout = XLSX.write (wb, {bookType:'xlsx', type:'binary'});
                saveAs (new Blob ([s2ab (wbout)], {type:"application/octet-stream"}), excelFileName);
            };
            reader.readAsText (file, "euc-kr");
        }
    }
}

// 파일 저장 루틴
function s2ab (s) {
    let buf = new ArrayBuffer (s.length);
    let view = new Uint8Array (buf);
    for (let i=0 ; i < s.length ; i++) view [i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
