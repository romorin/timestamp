const Transform = require('stream').Transform;

class ReplaceTransform extends Transform {
  constructor(toReplace, replacement, options) {
		super(options);
		this.toReplace = toReplace;
		this.replacement = replacement;
	}

	_transform(chunk, encoding, callback) {
		this.push(chunk.toString('utf-8').replace(this.toReplace, this.replacement));
		callback();
	}
}

module.exports = ReplaceTransform;
