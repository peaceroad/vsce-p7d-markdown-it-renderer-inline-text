const commands = require('vscode').commands
const workspace = require('vscode').workspace
const rendererInlineText = require('@peaceroad/markdown-it-renderer-inline-text/index.js')

async function activate () {
  const config = workspace.getConfiguration('p7dMarkdownItRendererInlineText')
  let exOption = {
    disableRuby: config.get('disableRuby'),
    disableStarComment: config.get('disableStarComment'),
    disableStarCommentLine: config.get('disableStarCommentLine'),
    deleteStarComment: config.get('deleteStarComment'),
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
  })

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
