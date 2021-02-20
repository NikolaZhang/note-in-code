import { getVSCodeDownloadUrl } from "vscode-test/out/util";
import { BeginEntity } from "../entity/TemplateEntity";
import { convertJson } from "../util/ObjectUtils";
import { formatPrefix } from "../util/StringUtils";

function testJsonParse() {
    let config =
        '{"title": "main", "type": "java", "tag": ["main", "java"], "codeBegin": 0, "codeEnd": 3, "methods": []}';
    let beginInfo = new BeginEntity();
    convertJson(config, beginInfo);

    console.log(beginInfo);

    let t = JSON.parse(config);
    console.log(t);
    Object.assign(beginInfo, t);

    console.log(beginInfo);
}

// function removePrefix(lines: Array<string>) { 
//     let spaceCount = 0;
//     let tabCount = 0;

//     lines.forEach(item => { 
//         for (let i = 0; i < item.length; i++) {
//             if (" ") { 

//             }
//         }
//     })
// }






function testChar() { 
    console.log("\t" === "	");
}

function stringsReplace() { 
    let arr = ['abc', 'acd'];

    arr.forEach(item => {
        item = item.replace("a", "xx");
    });
    console.log(arr);
}

// testJsonParse();
// testChar();
stringsReplace();


let lines1 = `public void test2() {
     }
`;
let lines2 =
    `
     public void test3() {

     }
    `;
let lines3 = `
     public void test3() {
 }`;
console.log(formatPrefix(lines1));
console.log(formatPrefix(lines2));
console.log(formatPrefix(lines3));


if (0) {
    console.log(0);
}


if (-1) {
    console.log(-1);
}