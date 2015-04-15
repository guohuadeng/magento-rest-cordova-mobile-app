" Vim syntax file
" Language:	jTemplate
" Maintainer:	Daniel Eloff <dan.eloff@gmail.com>, Tomasz Gloc <tpython@tpython.com>
" Last Change:	2011-11-20

" For version 5.x: Clear all syntax items
" For version 6.x: Quit when a syntax file was already loaded
if version < 600
  syntax clear
elseif exists("b:current_syntax")
  finish
endif

if !exists("main_syntax")
  let main_syntax = 'html'
endif

if version < 600
  so <sfile>:p:h/html.vim
else
  runtime! syntax/html.vim
  unlet b:current_syntax
endif

syn region  htmlString   contained start=+"+ end=+"+ contains=htmlSpecialChar,javaScriptExpression,@htmlPreproc,jTemplateVarBlock,jTemplateTagBlock

if !exists("html_no_rendering")
  " rendering
  syn cluster htmlTop contains=@Spell,htmlTag,htmlEndTag,htmlSpecialChar,htmlPreProc,htmlComment,htmlLink,javaScript,@htmlPreproc,jTemplateVarBlock,jTemplateTagBlock
endif

" Django template built-in tags and parameters
" 'comment' doesn't appear here because it gets special treatment
syn keyword jTemplateStatement contained if else elseif for foreach include param var cycle template continue break
syn keyword jTemplateStatement_attr contained as name value begin count step root values

syn match jTemplateSuperGlobals contained /\$[TPQ]/

" Django template constants (always surrounded by double quotes)
syn region jTemplateString contained start=+"+ skip=+\\"+ end=+"+

syn match jTemplateVars "\$[TPQ]\{1}\.[^} ]*"

" Django template tag and variable blocks
syn region jTemplateVarBlock start="{" end="}" contains=jTemplateString,jTemplateSuperGlobals,jTemplateVars display
syn region jTemplateTagBlock start="{#" end="}" contains=jTemplateStatement,jTemplateStatement_attr,jTemplateVars,jTemplateSuperGlobals,jTemplateString display

" Django template 'comment' tag and comment block
syn region jTemplateComBlock start=+{\*+ end=+\*}+

" Define the default highlighting.
" For version 5.7 and earlier: only when not done already
" For version 5.8 and later: only when an item doesn't have highlighting yet
if version >= 508 || !exists("did_jtemplate_syn_inits")
  if version < 508
    let did_jtemplate_syn_inits = 1
    command -nargs=+ HiLink hi link <args>
  else
    command -nargs=+ HiLink hi def link <args>
  endif

  hi jTemplate_tagBlock ctermfg=DarkGreen guifg=DarkGreen
  hi jTemplate_statement term=bold ctermfg=DarkYellow gui=bold guifg=DarkYellow
  hi jTemplate_vars term=underline ctermfg=DarkGreen gui=underline guifg=DarkGreen

  HiLink jTemplateTagBlock jTemplate_tagBlock
  HiLink jTemplateVarBlock PreProc
  HiLink jTemplateStatement jtemplate_statement
  HiLink jTemplateStatement_attr jTemplate_statement
  HiLink jTemplateVars jTemplate_vars
  HiLink jTemplateSuperGlobals Identifier
  HiLink jTemplateString Constant
  HiLink jTemplateComBlock Comment

  delcommand HiLink
endif

let b:current_syntax = "jtemplate"
