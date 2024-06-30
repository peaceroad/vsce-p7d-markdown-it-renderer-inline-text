const commands = require('vscode').commands
const window = require('vscode').window
const workspace = require('vscode').workspace
const Range = require('vscode').Range

const rendererInlineText = require('@peaceroad/markdown-it-renderer-inline-text')

async function activate (context) {
  const config = workspace.getConfiguration('p7dMarkdownItRendererInlineText')
  let exOption = {
    disableRuby: config.get('disableRuby'),
    disableStarComment: config.get('disableStarComment'),
    disableStarCommentLine: config.get('disableStarCommentLine'),
    deleteStarComment: config.get('deleteStarComment'),
    disableEditorStyle: config.get('disableEditorStyle'),
    starCommentLightColor: config.get('starCommentLightColor') ? config.get('starCommentLightColor') : 'rgba(139, 0, 0, 1)',
    starCommentDarkColor: config.get('starCommentDarkColor') ? config.get('starCommentDarkColor') : 'rgba(205, 92, 92, 1)',
    rubyLightColor: config.get('rubyLightColor') ? config.get('rubyLightColor') : 'rgba(128, 128, 0, 1)',
    rubyDarkColor: config.get('rubyDarkColor') ? config.get('rubyDarkColor') : 'rgba(128, 128, 0, 1)',
  }

  workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('p7dMarkdownItRendererInlineText.disableRuby')) {
      exOption.disableRuby = config.get('disableRuby')
      commands.executeCommand('workbench.action.reloadWindow')
    }
    if (event.affectsConfiguration('p7dMarkdownItRendererInlineText.disableStarComment')) {
      exOption.disableStarComment = config.get('disableStarComment')
      commands.executeCommand('workbench.action.reloadWindow')
    }
    if (event.affectsConfiguration('p7dMarkdownItRendererInlineText.disableStarCommentLine')) {
      exOption.disableStarComment = config.get('disableStarCommentLine')
      commands.executeCommand('workbench.action.reloadWindow')
    }
    if (event.affectsConfiguration('p7dMarkdownItRendererInlineText.deleteStarComment')) {
      exOption.deleteStarComment = config.get('deleteStarComment')
      commands.executeCommand('workbench.action.reloadWindow')
    }
    if (event.affectsConfiguration('p7dMarkdownItRendererInlineText.disableEditorStyle')) {
      exOption.deleteStarComment = config.get('disableEditorStyle')
      commands.executeCommand('workbench.action.reloadWindow')
    }
  })

  const starCommentStyle = window.createTextEditorDecorationType({
    light: {
      color: exOption.starCommentLightColor,
    },
    dark: {
      color: exOption.starCommentDarkColor,
    },
  })
  const rubyRtStyle = window.createTextEditorDecorationType({
    light: {
      color: exOption.rubyLightColor,
    },
    dark: {
      color: exOption.rubyDarkColor,
    },
  })


  const updateDecorations = (editor, starCommentStyle, rubyRtStyle) => {
    if (!editor || editor.document.languageId !== 'markdown') return
    const text = editor.document.getText()
    const starCommentDecorations = []
    const rubyRtDecorations = []
    let len = 0

    const texts = text.split(/(?<=(?:^|\r?\n))([`~]){3,}[\s\S]*?\r?\n *\1/).filter((_, index) => index % 2 === 0)
    const matchTexts = text.match(/(?<=(?:^|\r?\n))([`~]){3,}[\s\S]*?\r?\n *\1/g)

    //const scReg = /(?<!(?:^|[^\\])\\)★[^★\n]*?(?:(?<![^\\]\\)★|\r?\n *(?<!^(?:[-+*] )[\s\S]*?)\r?\n *[^★\n]*?(?<![^\\]\\)★)/gm
    const scReg = /(?<!(?:^|[^\\])\\)★[^★\n]*?(?:(?<![^\\]\\)★|\r?\n *[^★\n]*?(?:(?!\r?\n *)\r?\n *[^★\n]*?)*?(?<![^\\]\\)★)/g
    const scStartReg = /(?<=^|\r?\n *\r?\n) {0,3}(?<![^\\]\\)★[\s\S]*?(?=\r?\n *(?:\r?\n|$))/g
    const rubyRtReg = /(<ruby>)?([\p{sc=Han}0-9A-Za-z.\-_]+)《([^》]+?)》(<\/ruby>)?/gu

    let matchStarComment
    let matchRubyRt
    let i = 0
    while (i < texts.length) {
      len += i === 0 ? 0 : matchTexts[i - 1].length
      const currentText = texts[i]
      while (matchStarComment = scStartReg.exec(currentText)) {
        const starCommentRange = new Range(
          editor.document.positionAt(matchStarComment.index + len),
          editor.document.positionAt(matchStarComment.index + matchStarComment[0].length + len)
        )
        starCommentDecorations.push({
          range: starCommentRange,
          hoverMessage: 'Star Comment',
        })
      }
      while (matchStarComment = scReg.exec(currentText)) {
        console.log(matchStarComment)
        if (!/\r?\n *\r?\n/.test(matchStarComment)) {
          const starCommentRange = new Range(
            editor.document.positionAt(matchStarComment.index + len),
            editor.document.positionAt(matchStarComment.index + matchStarComment[0].length + len)
          )
          starCommentDecorations.push({
            range: starCommentRange,
            hoverMessage: 'Star Comment',
          })
        }
      }

      while (matchRubyRt = rubyRtReg.exec(currentText)) {
        let rubyTagStartLen = matchRubyRt[1] ? matchRubyRt[1].length : 0
        let rubyTagEndLen = matchRubyRt[4] ? matchRubyRt[4].length : 0
        let rubyTextStart = matchRubyRt.index + rubyTagStartLen
        let rubyTextEnd = rubyTextStart + matchRubyRt[2].length + matchRubyRt[3].length + 2

        const rubyRtRange = new Range(
          editor.document.positionAt(rubyTextStart + len),
          editor.document.positionAt(rubyTextEnd + len)
        )
        rubyRtDecorations.push({
          range: rubyRtRange,
          hoverMessage: 'Ruby Rt',
          decorationType: rubyRtStyle,
        })
      }
      if (i < texts.length - 1) {
        len += currentText.length
      }
      i++
    }

    editor.setDecorations(starCommentStyle, starCommentDecorations)
    editor.setDecorations(rubyRtStyle, rubyRtDecorations)
  }

  if (!exOption.disableEditorStyle) {
    updateDecorations(window.activeTextEditor, starCommentStyle, rubyRtStyle)
    window.onDidChangeActiveTextEditor(editor => {
      if (editor) updateDecorations(editor, starCommentStyle, rubyRtStyle)
    }, null, context.subscriptions)
    workspace.onDidChangeTextDocument(event => {
      if (window.activeTextEditor && event.document === window.activeTextEditor.document) {
        updateDecorations(window.activeTextEditor, starCommentStyle, rubyRtStyle)
      }
    }, null, context.subscriptions)
  }

  return {
    extendMarkdownIt(md) {
      md.use(rendererInlineText, {
        ruby: !exOption.disableRuby,
        starComment: !exOption.disableStarComment,
        starCommentLine: !exOption.disableStarCommentLine,
        starCommentDelete: exOption.deleteStarComment,
      })
      return md
    }
  }
}

exports.activate = activate
