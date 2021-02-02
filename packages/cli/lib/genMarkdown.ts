/* eslint-disable prefer-const */
import path from 'path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import Log from 'log-horizon'
import { CliOptions } from '.'
import { parser } from '@hjtvuese/parser'
import Render from '@hjtvuese/markdown-render'

type MarkdownResult = Promise<
  Promise<
    | {
        compName: string
        groupName: string
        content: string
      }
    | undefined
  >[]
>

type modifyJson = {
  [key: string]: Date
}

const logger = Log.create()
export const lastModifyJson: modifyJson = {};
export default async (config: CliOptions): MarkdownResult => {
  let {
    include,
    exclude,
    outDir,
    markdownDir,
    markdownFile,
    babelParserPlugins,
    isPreview,
    genType,
    keepFolderStructure
  } = config

  let lastModify: modifyJson = {};

  if (!isPreview) logger.progress('Start creating markdown files...')

  if (typeof include === 'string') include = [include]
  if (typeof exclude === 'string') exclude = [exclude]
  exclude = exclude.concat('node_modules/**/*.(vue|js)')

  const files = await fg(include.concat(exclude.map(p => `!${p}`)))

  // lastModify记录文件是否存在
  const lastModifyExist = fs.pathExistsSync(path.resolve(outDir, 'components/lastModify.json'));
  if (lastModifyExist) {
      // 记录文件存在
      lastModify = fs.readJsonSync(path.resolve(outDir, 'components/lastModify.json'));
  }

  return files.map(async (p: string) => {
    const pArr = p.split('\/');
    pArr.pop();
    if (pArr[0] === '.') pArr.shift();
    const hash = pArr.join('.');
    const abs = path.resolve(p)
    const source = await fs.readFile(abs, 'utf-8')
    try {
      const parserRes = parser(source, {
        babelParserPlugins,
        basedir: path.dirname(abs),
        jsFile: abs.endsWith('.js')
      })
      const r = new Render(parserRes)
      const markdownRes = r.renderMarkdown()

      if (!markdownRes) return

      let str = markdownRes.content
      const compName = markdownRes.componentName
        ? markdownRes.componentName
        : path.basename(abs, '.vue')
      const groupName = markdownRes.groupName

      str = str.replace(/\[name\]/g, compName)
      let targetDir = ''
      let targetFile = ''
      if (genType === 'markdown' && markdownDir === '*') {
        targetDir = path.dirname(abs)
        targetFile = markdownFile || compName
      } else {
        targetDir = path.resolve(
          outDir,
          markdownDir === '*' ? 'components' : markdownDir
        )
        targetFile = compName
      }

      const folderStructureMiddlePath: string = keepFolderStructure
        ? getGlobPatternMatchPath(include as string[], path.dirname(p))
        : ''
      const target = path.resolve(
        targetDir,
        folderStructureMiddlePath,
        targetFile + `[${hash}]` + '.md'
      )
      if (!isPreview) {
        // 存储last-modify记录
        const pInfo = await fs.stat(abs)
        lastModifyJson[targetFile + `[${hash}]`] = pInfo.mtime
        await fs.ensureDir(path.resolve(targetDir, folderStructureMiddlePath))
        if (!lastModifyExist || !lastModify[targetFile + `[${hash}]`] || new Date(lastModify[targetFile + `[${hash}]`]) < pInfo.mtime) {
          // 如果lastmodify文件不存在||最后修改时间小于当前文件的修改时间，重新生成
          await fs.writeFile(target, str)
          logger.success(`Successfully created: ${target}`)
        } else {
          logger.success(`Not modify: ${target}`);
        }
      }

      return {
        compName,
        groupName,
        content: str,
        hash
      }
    } catch (e) {
      logger.error(`The error occurred when processing: ${abs}`)
      logger.error(e)
    }
  })
}

function getGlobPatternMatchPath(
  globPatternList: string[],
  targetPath: string
): string {
  let index = Infinity
  let res = ''
  for (let i = 0; i < globPatternList.length; i++) {
    let ep: string = explicitPrefix(globPatternList[i])
    if (targetPath.startsWith(ep) && ep.length < index) {
      index = ep.length
      res = ep
    }
  }
  res = targetPath.slice(res.length)
  return res[0] === '/' ? res.slice(1) : res
}

function explicitPrefix(pattern: string): string {
  let patternList = pattern.split('/')
  let resi = 0
  while (patternList[resi] && patternList[resi] !== '**') {
    resi++
  }
  return patternList.slice(0, resi).join('/')
}
