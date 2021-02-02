import sao from 'sao'
import path from 'path'
import genMarkdown, { lastModifyJson } from './genMarkdown'
import Log from 'log-horizon'
import { CliOptions } from './'
import fs from 'fs-extra'

const logger = Log.create()

export default async (config: CliOptions): Promise<void> => {
  try {
    const componentsPromise = await genMarkdown(config)
    const componentRes = await Promise.all(componentsPromise)
    const components = componentRes.filter(_ => _)
    logger.progress('Start generating...')
    await sao({
      template: path.resolve(__dirname, './templates/docute'),
      targetPath: path.resolve(config.outDir as string),
      configOptions: {
        components,
        title: config.title,
        markdownDir: config.markdownDir
      }
    })
    logger.success('lastModify.json Generated successfully')
    fs.writeJsonSync(path.resolve(config.outDir, 'components/lastModify.json'), lastModifyJson);
    logger.success('Generated successfully')
  } catch (err) {
    console.error(err.name === 'SAOError' ? err.message : err.stack)
    process.exit(1)
  }
}
