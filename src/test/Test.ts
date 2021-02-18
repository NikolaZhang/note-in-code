import { BeginEntity } from "../entity/TemplateEntity";
import { convertJson } from "../util/ObjectUtils";


let config = '{"title": "main", "type": "java", "tag": ["main", "java"], "codeBegin": 0, "codeEnd": 3, "methods": []}';
let beginInfo = new BeginEntity();
convertJson(config, beginInfo);

console.log(beginInfo);

let t = JSON.parse(config);
console.log(t);
Object.assign(beginInfo, t);

console.log(beginInfo);
