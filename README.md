# vsce-p7d-markdown-it-renderer-inline-text README

This extension gives the following expression to the Markdown preview.

- Ruby (`《》`)
- Star comment (`★`)

## Ruby

- Match: `(<ruby>)?([\p{sc=Han}0-9A-Za-z.\-_]+)《([^》]+?)》(<\/ruby>)?/u`
- Replace: `<ruby>$2<rp>《</rp><rt>$3</rt><rp>》</rp></ruby>`


```
[Markdown]
この環境では超電磁砲《レールガン》を変換できます。
[HTML]
<p>この環境では<ruby>超電磁砲<rp>《</rp><rt>レールガン</rt><rp>》</rp></ruby>を変換できます。</p>

[Markdown]
ここには高出力<ruby>超電磁砲《レールガン》</ruby>が装備されています。
[HTML]
<p>ここには高出力<ruby>超電磁砲<rp>《</rp><rt>レールガン</rt><rp>》</rp></ruby>が装備されています。</p>

[Markdown]
CSSはW3C《だぶるさんしー》は策定しています。
[HTML]
<p>CSSは<ruby>W3C<rp>《</rp><rt>だぶるさんしー</rt><rp>》</rp></ruby>は策定しています。</p>

[Markdown]
CSSは非営利団体<ruby>W3C《だぶるさんしー》</ruby>は策定しています。
[HTML]
<p>CSSは非営利団体<ruby>W3C<rp>《</rp><rt>だぶるさんしー</rt><rp>》</rp></ruby>は策定しています。</p>
```

## Star Comment

The following string is considered a comment.

- Text surrounded by ★
- Paragraph starts with ★
- Replace: `<span class="star-comment">$1</span>`


```
[Markdown]
文章中の★スターコメント★は処理されます。
[HTML]
<p>文章中の<span class="star-comment">★スターコメント★</span>は処理されます。</p>

[Markdown]
★この段落はコメントとみなします。
[HTML]
<p><span class="star-comment">★この段落はコメントとみなします。</span></p>
```

---

Notice. By using `\` before ★, it will be converted without making it a comment. However, if two or more `\` characters are used in succession, they will be converted differently from the Markdown specifications (for now). Details are below.

```
[Markdown]
文章中★のスターコメント\★は処理されます。
[HTML]
<p>文章中★のスターコメント★は処理されます。</p>

[Markdown]
文章中★のスターコメント\\★は処理されます。
[HTML]
<p>文章中★のスターコメント★は処理されます。</p>

[Markdown]
文章中★のスターコメント\\\★は処理されます。
[HTML]
<p>文章中<span class="star-comment">★のスターコメント\\★</span>は処理されます。</p>
```

---

### Option: Delete Star Comment

If you delete star comment, `p7dMarkdownItRendererInlineText.deleteStarComment` in option set true.

```
[Markdown]
文章中の★スターコメント★は処理されます。
[HTML:delete]
<p>文章中のは処理されます。</p>
```
