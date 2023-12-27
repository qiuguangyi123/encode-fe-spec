const assert = require("assert")
const stylelint = require("stylelint")
const path = require("path")

describe("test/rules-validate.test.js", () => {
  it("Validate default", async () => {
    const filePaths = path.resolve(__dirname, "./fixtures/index.css")
    const result = await stylelint.lint({
      configFile: path.resolve(__dirname, "../index.js"),
      files: filePaths,
      fix: false,
    })
    // 如果检测出有错误 就打印 警告不管
    if (result && result.errored) {
      const arr = JSON.parse(result.output || "[]")
      // 每一个对象代表一个文件
      arr.forEach(file => {
        console.log(`========= ${filePaths} ==========`)
        file.warnings.forEach(warning => {
          console.log(warning)
        })
      })
      // 报错了 是否有报错信息出来
      assert.ok(arr.length > 0)
    }
  })
  it("Validate default", async () => {
    const filePaths = path.resolve(__dirname, "./fixtures/less-test.less")
    const result = await stylelint.lint({
      configFile: path.resolve(__dirname, "../index.js"),
      files: filePaths,
      fix: false,
    })
    // 如果检测出有错误 就打印 警告不管
    if (result && result.errored) {
      const arr = JSON.parse(result.output || "[]")
      // 每一个对象代表一个文件
      arr.forEach(file => {
        console.log(`========= ${filePaths} ==========`)
        file.warnings.forEach(warning => {
          console.log(warning)
        })
      })
      // 报错了 是否有报错信息出来
      assert.ok(arr.length > 0)
    }
  })
})
