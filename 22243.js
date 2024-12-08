// 22243.js
const fs = require("fs");
const path = require("path");
const { off } = require("process");
const token = "22243";
const begIf = "{if";
const begLoop = "{for";
const begPartial = "{+";

const begElse = "{else}";
const endIf = "{/if}";
const endDoc = "{/doc}";
const endLoop = "{/for}";

function getObjectOfContext(key, context) {
  return key.split(".").reduce((obj, property) => {
    return obj && obj[property];
  }, context);
}
function getObject(key, context, loopContext) {
  const str = getObjectOfContext(key, loopContext);
  return str ? str : getObjectOfContext(key, context);
}
function matchToken(template, offset) {
  return (
    template[offset] === token[0] &&
    template.substring(offset, offset + token.length) === token
  );
}
function parse(template, offset, context, loopContext, end) {
  let result = [];
  while (offset < template.length) {
    if (template.substring(offset, offset + end.length) === end) {
      return {
        offset: offset + end.length,
        result: result.join(""),
      };
    }
    if (matchToken(template, offset)) {
      const parsed = parseToken(template, offset, context, loopContext);
      offset = parsed.offset;
      result.push(parsed.result);
      continue;
    }
    result.push(template[offset++]);
  }
  throw new Error("No enclose token " + end);
}
function parseToken(template, offset, context, loopContext) {
  console.log(
    template.substring(offset + token.length, offset + token.length + 10)
  );
  if (template.startsWith(begIf, offset + token.length)) {
    return parseIf(template, offset, context, loopContext);
  } else if (template.startsWith(begLoop, offset + token.length)) {
    return parseLoop(template, offset, context, loopContext);
  } else if (template.startsWith(begPartial, offset + token.length)) {
    return parsePartial(template, offset, context, loopContext);
  }
  return parseVar(template, offset, context, loopContext);
}
function parsePartial(template, offset, context, loopContext) {
  const s = template.indexOf("{", offset) + 1;
  const e = template.indexOf("}", offset);
  const partial_name = template.substring(s, e).trim();
  const filename = "./views" + partial_name + "." + token;
  const content = fs.readFileSync(filename, "utf8");
  return {
    result: parse(content, 0, context, loopContext),
    offset: e + 1,
  };
}

function parseVar(template, offset, context, loopContext) {
  const open = template.indexOf("{", offset);
  const close = template.indexOf("}", offset);
  const key = template.substring(open + 1, close).trim();
  return {
    offset: close + 1,
    result: String(getObject(key, context, loopContext)),
  };
}
function parseIf(template, offset, context, loopContext) {
  let ifInStack = 0;
  let posElse = -1,
    posEndIf = -1;
  for (let i = offset; i < template.length; i++) {
    if (template.startsWith(begIf, i)) {
      ifInStack++;
    } else if (template.startsWith(endIf, i)) {
      if (--ifInStack == 0) {
        posEndIf = i;
        break;
      }
    } else if (template.startsWith(begElse, i)) {
      if (ifInStack == 1) {
        posElse = i;
      }
    }
  }
  if (posEndIf == -1) throw new Error("Missing if enclose");
  const s = template.indexOf(begIf, offset) + begIf.length;
  const e = template.indexOf("}", s);
  const key = template.substring(s, e).trim();
  let incorrect = !getObject(key, context, loopContext);
  if (incorrect) {
    if (posElse == -1) {
      return {
        offset: posEndIf + endIf.length,
        result: "",
      };
    } else {
      return parse(
        template,
        posElse + begElse.length,
        context,
        loopContext,
        endIf
      );
    }
  }
  const parsed = parse(template, e + 1, context, loopContext, begElse);
  parsed.offset = posEndIf + endIf.length;
  return parsed;
}
function parseLoop(template, offset, context, loopContext) {
  const s = template.indexOf(begLoop, offset) + begLoop.length;
  const e = template.indexOf("}", s);

  const statement = template.substring(s, e);

  const z = statement.split("in");
  const item_name = z[0].trim();
  const arr_name = z[1].trim();
  const arr = getObject(arr_name, context, loopContext);
  console.log(arr);
  let result = [];
  if (!arr) throw new Error("No array found: " + arr_name);
  for (const item of arr) {
    loopContext[item_name] = item;
    let parsed = parse(template, e + 1, context, loopContext, endLoop);
    result.push(parsed.result);
    offset = parsed.offset;
  }
  delete loopContext[item_name];
  return {
    offset: offset,
    result: result.join(""),
  };
}

function render(template, context) {
  return parse(template + endDoc, 0, context, {}, endDoc).result;
}
module.exports = function (filePath, options, callback) {
  console.log(options);
  fs.readFile(filePath, "utf8", (err, template) => {
    if (err) return callback(err);
    try {
      const rendered = render(template, options);
      fs.writeFile("test.html", rendered, (err) => {
        if (err) {
          console.error(err);
        }
      });
      callback(null, rendered);
    } catch (err) {
      callback(err);
    }
  });
};
