import fs from 'fs';
import { SourceNodeInfo } from 'broccoli-node-api';
import NodeWrapper from './node';
import undefinedToNull from '../utils/undefined-to-null';

export default class SourceNodeWrapper extends NodeWrapper {
  nodeInfo!: SourceNodeInfo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setup(/* features */) {}
  build() {
    // We only check here that the sourceDirectory exists and is a directory
    try {
      if (!fs.statSync(this.nodeInfo.sourceDirectory).isDirectory()) {
        throw new Error('Not a directory');
      }
    } catch (err) {
      // stat might throw, or we might throw
      err.file = this.nodeInfo.sourceDirectory;
      // fs.stat augments error message with file name, but that's redundant
      // with our err.file, so we strip it
      err.message = err.message.replace(/, stat '[^'\n]*'$/m, '');
      throw err;
    }

    this.buildState.selfTime = 0;
    this.buildState.totalTime = 0;
  }

  toString() {
    const hint = this.nodeInfo.sourceDirectory + (this.nodeInfo.watched ? '' : ' (unwatched)');
    return '[NodeWrapper:' + this.id + ' ' + hint + ']';
  }

  nodeInfoToJSON() {
    return undefinedToNull({
      nodeType: 'source',
      sourceDirectory: this.nodeInfo.sourceDirectory,
      watched: this.nodeInfo.watched,
      name: this.nodeInfo.name,
      annotation: this.nodeInfo.annotation,
      // leave out instantiationStack
    });
  }
}
