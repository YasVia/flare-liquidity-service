// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = import.meta.require;

// node_modules/dotenv/lib/main.js
var require_main = __commonJS((exports, module) => {
  var fs = __require("fs");
  var path = __require("path");
  var os = __require("os");
  var crypto2 = __require("crypto");
  var TIPS = [
    "\u25C8 encrypted .env [www.dotenvx.com]",
    "\u25C8 secrets for agents [www.dotenvx.com]",
    "\u2301 auth for agents [www.vestauth.com]",
    "\u2318 custom filepath { path: '/custom/path/.env' }",
    "\u2318 enable debugging { debug: true }",
    "\u2318 override existing { override: true }",
    "\u2318 suppress logs { quiet: true }",
    "\u2318 multiple files { path: ['.env.local', '.env'] }"
  ];
  function _getRandomTip() {
    return TIPS[Math.floor(Math.random() * TIPS.length)];
  }
  function parseBoolean(value) {
    if (typeof value === "string") {
      return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
    }
    return Boolean(value);
  }
  function supportsAnsi() {
    return process.stdout.isTTY;
  }
  function dim(text) {
    return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
  }
  var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  function parse(src) {
    const obj = {};
    let lines = src.toString();
    lines = lines.replace(/\r\n?/mg, `
`);
    let match2;
    while ((match2 = LINE.exec(lines)) != null) {
      const key = match2[1];
      let value = match2[2] || "";
      value = value.trim();
      const maybeQuote = value[0];
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, `
`);
        value = value.replace(/\\r/g, "\r");
      }
      obj[key] = value;
    }
    return obj;
  }
  function _parseVault(options) {
    options = options || {};
    const vaultPath = _vaultPath(options);
    options.path = vaultPath;
    const result = DotenvModule.configDotenv(options);
    if (!result.parsed) {
      const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      err.code = "MISSING_DATA";
      throw err;
    }
    const keys = _dotenvKey(options).split(",");
    const length = keys.length;
    let decrypted;
    for (let i = 0;i < length; i++) {
      try {
        const key = keys[i].trim();
        const attrs = _instructions(result, key);
        decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
        break;
      } catch (error) {
        if (i + 1 >= length) {
          throw error;
        }
      }
    }
    return DotenvModule.parse(decrypted);
  }
  function _warn(message) {
    console.error(`\u26A0 ${message}`);
  }
  function _debug(message) {
    console.log(`\u2506 ${message}`);
  }
  function _log(message) {
    console.log(`\u25C7 ${message}`);
  }
  function _dotenvKey(options) {
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY;
    }
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY;
    }
    return "";
  }
  function _instructions(result, dotenvKey) {
    let uri;
    try {
      uri = new URL(dotenvKey);
    } catch (error) {
      if (error.code === "ERR_INVALID_URL") {
        const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      throw error;
    }
    const key = uri.password;
    if (!key) {
      const err = new Error("INVALID_DOTENV_KEY: Missing key part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environment = uri.searchParams.get("environment");
    if (!environment) {
      const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
    const ciphertext = result.parsed[environmentKey];
    if (!ciphertext) {
      const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
      throw err;
    }
    return { ciphertext, key };
  }
  function _vaultPath(options) {
    let possibleVaultPath = null;
    if (options && options.path && options.path.length > 0) {
      if (Array.isArray(options.path)) {
        for (const filepath of options.path) {
          if (fs.existsSync(filepath)) {
            possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
          }
        }
      } else {
        possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
      }
    } else {
      possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
    }
    if (fs.existsSync(possibleVaultPath)) {
      return possibleVaultPath;
    }
    return null;
  }
  function _resolveHome(envPath) {
    return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
  }
  function _configVault(options) {
    const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
    const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
    if (debug || !quiet) {
      _log("loading env from encrypted .env.vault");
    }
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return { parsed };
  }
  function configDotenv(options) {
    const dotenvPath = path.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
    let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
    if (options && options.encoding) {
      encoding = options.encoding;
    } else {
      if (debug) {
        _debug("no encoding is specified (UTF-8 is used by default)");
      }
    }
    let optionPaths = [dotenvPath];
    if (options && options.path) {
      if (!Array.isArray(options.path)) {
        optionPaths = [_resolveHome(options.path)];
      } else {
        optionPaths = [];
        for (const filepath of options.path) {
          optionPaths.push(_resolveHome(filepath));
        }
      }
    }
    let lastError;
    const parsedAll = {};
    for (const path2 of optionPaths) {
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
        DotenvModule.populate(parsedAll, parsed, options);
      } catch (e) {
        if (debug) {
          _debug(`failed to load ${path2} ${e.message}`);
        }
        lastError = e;
      }
    }
    const populated = DotenvModule.populate(processEnv, parsedAll, options);
    debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
    quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
    if (debug || !quiet) {
      const keysCount = Object.keys(populated).length;
      const shortPaths = [];
      for (const filePath of optionPaths) {
        try {
          const relative = path.relative(process.cwd(), filePath);
          shortPaths.push(relative);
        } catch (e) {
          if (debug) {
            _debug(`failed to load ${filePath} ${e.message}`);
          }
          lastError = e;
        }
      }
      _log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
    }
    if (lastError) {
      return { parsed: parsedAll, error: lastError };
    } else {
      return { parsed: parsedAll };
    }
  }
  function config(options) {
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options);
    }
    const vaultPath = _vaultPath(options);
    if (!vaultPath) {
      _warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
      return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
  }
  function decrypt(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), "hex");
    let ciphertext = Buffer.from(encrypted, "base64");
    const nonce = ciphertext.subarray(0, 12);
    const authTag = ciphertext.subarray(-16);
    ciphertext = ciphertext.subarray(12, -16);
    try {
      const aesgcm = crypto2.createDecipheriv("aes-256-gcm", key, nonce);
      aesgcm.setAuthTag(authTag);
      return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
    } catch (error) {
      const isRange = error instanceof RangeError;
      const invalidKeyLength = error.message === "Invalid key length";
      const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
      if (isRange || invalidKeyLength) {
        const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      } else if (decryptionFailed) {
        const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        err.code = "DECRYPTION_FAILED";
        throw err;
      } else {
        throw error;
      }
    }
  }
  function populate(processEnv, parsed, options = {}) {
    const debug = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    const populated = {};
    if (typeof parsed !== "object") {
      const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      err.code = "OBJECT_REQUIRED";
      throw err;
    }
    for (const key of Object.keys(parsed)) {
      if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
        if (override === true) {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
        if (debug) {
          if (override === true) {
            _debug(`"${key}" is already defined and WAS overwritten`);
          } else {
            _debug(`"${key}" is already defined and was NOT overwritten`);
          }
        }
      } else {
        processEnv[key] = parsed[key];
        populated[key] = parsed[key];
      }
    }
    return populated;
  }
  var DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config,
    decrypt,
    parse,
    populate
  };
  exports.configDotenv = DotenvModule.configDotenv;
  exports._configVault = DotenvModule._configVault;
  exports._parseVault = DotenvModule._parseVault;
  exports.config = DotenvModule.config;
  exports.decrypt = DotenvModule.decrypt;
  exports.parse = DotenvModule.parse;
  exports.populate = DotenvModule.populate;
  module.exports = DotenvModule;
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS((exports, module) => {
  var options = {};
  if (process.env.DOTENV_CONFIG_ENCODING != null) {
    options.encoding = process.env.DOTENV_CONFIG_ENCODING;
  }
  if (process.env.DOTENV_CONFIG_PATH != null) {
    options.path = process.env.DOTENV_CONFIG_PATH;
  }
  if (process.env.DOTENV_CONFIG_QUIET != null) {
    options.quiet = process.env.DOTENV_CONFIG_QUIET;
  }
  if (process.env.DOTENV_CONFIG_DEBUG != null) {
    options.debug = process.env.DOTENV_CONFIG_DEBUG;
  }
  if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
    options.override = process.env.DOTENV_CONFIG_OVERRIDE;
  }
  if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
    options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
  }
  module.exports = options;
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS((exports, module) => {
  var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
  module.exports = function optionMatcher(args) {
    const options = args.reduce(function(acc, cur) {
      const matches = cur.match(re);
      if (matches) {
        acc[matches[1]] = matches[2];
      }
      return acc;
    }, {});
    if (!("quiet" in options)) {
      options.quiet = "true";
    }
    return options;
  };
});

// node_modules/dotenv/config.js
var require_config = __commonJS(() => {
  (function() {
    require_main().config(Object.assign({}, require_env_options(), require_cli_options()(process.argv)));
  })();
});

// node_modules/viem/_esm/accounts/utils/parseAccount.js
function parseAccount(account) {
  if (typeof account === "string")
    return { address: account, type: "json-rpc" };
  return account;
}

// node_modules/viem/_esm/constants/abis.js
var multicall3Abi, batchGatewayAbi, universalResolverErrors, universalResolverResolveAbi, universalResolverReverseAbi, textResolverAbi, addressResolverAbi, erc1271Abi, erc6492SignatureValidatorAbi, erc20Abi;
var init_abis = __esm(() => {
  multicall3Abi = [
    {
      inputs: [
        {
          components: [
            {
              name: "target",
              type: "address"
            },
            {
              name: "allowFailure",
              type: "bool"
            },
            {
              name: "callData",
              type: "bytes"
            }
          ],
          name: "calls",
          type: "tuple[]"
        }
      ],
      name: "aggregate3",
      outputs: [
        {
          components: [
            {
              name: "success",
              type: "bool"
            },
            {
              name: "returnData",
              type: "bytes"
            }
          ],
          name: "returnData",
          type: "tuple[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          name: "addr",
          type: "address"
        }
      ],
      name: "getEthBalance",
      outputs: [
        {
          name: "balance",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "getCurrentBlockTimestamp",
      outputs: [
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ];
  batchGatewayAbi = [
    {
      name: "query",
      type: "function",
      stateMutability: "view",
      inputs: [
        {
          type: "tuple[]",
          name: "queries",
          components: [
            {
              type: "address",
              name: "sender"
            },
            {
              type: "string[]",
              name: "urls"
            },
            {
              type: "bytes",
              name: "data"
            }
          ]
        }
      ],
      outputs: [
        {
          type: "bool[]",
          name: "failures"
        },
        {
          type: "bytes[]",
          name: "responses"
        }
      ]
    },
    {
      name: "HttpError",
      type: "error",
      inputs: [
        {
          type: "uint16",
          name: "status"
        },
        {
          type: "string",
          name: "message"
        }
      ]
    }
  ];
  universalResolverErrors = [
    {
      inputs: [
        {
          name: "dns",
          type: "bytes"
        }
      ],
      name: "DNSDecodingFailed",
      type: "error"
    },
    {
      inputs: [
        {
          name: "ens",
          type: "string"
        }
      ],
      name: "DNSEncodingFailed",
      type: "error"
    },
    {
      inputs: [],
      name: "EmptyAddress",
      type: "error"
    },
    {
      inputs: [
        {
          name: "status",
          type: "uint16"
        },
        {
          name: "message",
          type: "string"
        }
      ],
      name: "HttpError",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidBatchGatewayResponse",
      type: "error"
    },
    {
      inputs: [
        {
          name: "errorData",
          type: "bytes"
        }
      ],
      name: "ResolverError",
      type: "error"
    },
    {
      inputs: [
        {
          name: "name",
          type: "bytes"
        },
        {
          name: "resolver",
          type: "address"
        }
      ],
      name: "ResolverNotContract",
      type: "error"
    },
    {
      inputs: [
        {
          name: "name",
          type: "bytes"
        }
      ],
      name: "ResolverNotFound",
      type: "error"
    },
    {
      inputs: [
        {
          name: "primary",
          type: "string"
        },
        {
          name: "primaryAddress",
          type: "bytes"
        }
      ],
      name: "ReverseAddressMismatch",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "selector",
          type: "bytes4"
        }
      ],
      name: "UnsupportedResolverProfile",
      type: "error"
    }
  ];
  universalResolverResolveAbi = [
    ...universalResolverErrors,
    {
      name: "resolveWithGateways",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "name", type: "bytes" },
        { name: "data", type: "bytes" },
        { name: "gateways", type: "string[]" }
      ],
      outputs: [
        { name: "", type: "bytes" },
        { name: "address", type: "address" }
      ]
    }
  ];
  universalResolverReverseAbi = [
    ...universalResolverErrors,
    {
      name: "reverseWithGateways",
      type: "function",
      stateMutability: "view",
      inputs: [
        { type: "bytes", name: "reverseName" },
        { type: "uint256", name: "coinType" },
        { type: "string[]", name: "gateways" }
      ],
      outputs: [
        { type: "string", name: "resolvedName" },
        { type: "address", name: "resolver" },
        { type: "address", name: "reverseResolver" }
      ]
    }
  ];
  textResolverAbi = [
    {
      name: "text",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "name", type: "bytes32" },
        { name: "key", type: "string" }
      ],
      outputs: [{ name: "", type: "string" }]
    }
  ];
  addressResolverAbi = [
    {
      name: "addr",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "name", type: "bytes32" }],
      outputs: [{ name: "", type: "address" }]
    },
    {
      name: "addr",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "name", type: "bytes32" },
        { name: "coinType", type: "uint256" }
      ],
      outputs: [{ name: "", type: "bytes" }]
    }
  ];
  erc1271Abi = [
    {
      name: "isValidSignature",
      type: "function",
      stateMutability: "view",
      inputs: [
        { name: "hash", type: "bytes32" },
        { name: "signature", type: "bytes" }
      ],
      outputs: [{ name: "", type: "bytes4" }]
    }
  ];
  erc6492SignatureValidatorAbi = [
    {
      inputs: [
        {
          name: "_signer",
          type: "address"
        },
        {
          name: "_hash",
          type: "bytes32"
        },
        {
          name: "_signature",
          type: "bytes"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [
        {
          name: "_signer",
          type: "address"
        },
        {
          name: "_hash",
          type: "bytes32"
        },
        {
          name: "_signature",
          type: "bytes"
        }
      ],
      outputs: [
        {
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function",
      name: "isValidSig"
    }
  ];
  erc20Abi = [
    {
      type: "event",
      name: "Approval",
      inputs: [
        {
          indexed: true,
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          name: "spender",
          type: "address"
        },
        {
          indexed: false,
          name: "value",
          type: "uint256"
        }
      ]
    },
    {
      type: "event",
      name: "Transfer",
      inputs: [
        {
          indexed: true,
          name: "from",
          type: "address"
        },
        {
          indexed: true,
          name: "to",
          type: "address"
        },
        {
          indexed: false,
          name: "value",
          type: "uint256"
        }
      ]
    },
    {
      type: "function",
      name: "allowance",
      stateMutability: "view",
      inputs: [
        {
          name: "owner",
          type: "address"
        },
        {
          name: "spender",
          type: "address"
        }
      ],
      outputs: [
        {
          type: "uint256"
        }
      ]
    },
    {
      type: "function",
      name: "approve",
      stateMutability: "nonpayable",
      inputs: [
        {
          name: "spender",
          type: "address"
        },
        {
          name: "amount",
          type: "uint256"
        }
      ],
      outputs: [
        {
          type: "bool"
        }
      ]
    },
    {
      type: "function",
      name: "balanceOf",
      stateMutability: "view",
      inputs: [
        {
          name: "account",
          type: "address"
        }
      ],
      outputs: [
        {
          type: "uint256"
        }
      ]
    },
    {
      type: "function",
      name: "decimals",
      stateMutability: "view",
      inputs: [],
      outputs: [
        {
          type: "uint8"
        }
      ]
    },
    {
      type: "function",
      name: "name",
      stateMutability: "view",
      inputs: [],
      outputs: [
        {
          type: "string"
        }
      ]
    },
    {
      type: "function",
      name: "symbol",
      stateMutability: "view",
      inputs: [],
      outputs: [
        {
          type: "string"
        }
      ]
    },
    {
      type: "function",
      name: "totalSupply",
      stateMutability: "view",
      inputs: [],
      outputs: [
        {
          type: "uint256"
        }
      ]
    },
    {
      type: "function",
      name: "transfer",
      stateMutability: "nonpayable",
      inputs: [
        {
          name: "recipient",
          type: "address"
        },
        {
          name: "amount",
          type: "uint256"
        }
      ],
      outputs: [
        {
          type: "bool"
        }
      ]
    },
    {
      type: "function",
      name: "transferFrom",
      stateMutability: "nonpayable",
      inputs: [
        {
          name: "sender",
          type: "address"
        },
        {
          name: "recipient",
          type: "address"
        },
        {
          name: "amount",
          type: "uint256"
        }
      ],
      outputs: [
        {
          type: "bool"
        }
      ]
    }
  ];
});

// node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiItem(abiItem, { includeName = false } = {}) {
  if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
    throw new InvalidDefinitionTypeError(abiItem.type);
  return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
  if (!params)
    return "";
  return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
  if (param.type.startsWith("tuple")) {
    return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : "");
}
var init_formatAbiItem = __esm(() => {
  init_abi();
});

// node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}

// node_modules/viem/_esm/utils/data/size.js
function size2(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
var init_size = () => {};

// node_modules/viem/_esm/errors/version.js
var version = "2.55.4";

// node_modules/viem/_esm/errors/base.js
function walk(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause !== undefined)
    return walk(err.cause, fn);
  return fn ? null : err;
}
var errorConfig, BaseError;
var init_base = __esm(() => {
  errorConfig = {
    getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : undefined,
    version: `viem@${version}`
  };
  BaseError = class BaseError extends Error {
    constructor(shortMessage, args = {}) {
      const details = (() => {
        if (args.cause instanceof BaseError)
          return args.cause.details;
        if (args.cause?.message)
          return args.cause.message;
        return args.details;
      })();
      const docsPath = (() => {
        if (args.cause instanceof BaseError)
          return args.cause.docsPath || args.docsPath;
        return args.docsPath;
      })();
      const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath });
      const message = [
        shortMessage || "An error occurred.",
        "",
        ...args.metaMessages ? [...args.metaMessages, ""] : [],
        ...docsUrl ? [`Docs: ${docsUrl}`] : [],
        ...details ? [`Details: ${details}`] : [],
        ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
      ].join(`
`);
      super(message, args.cause ? { cause: args.cause } : undefined);
      Object.defineProperty(this, "details", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "docsPath", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "metaMessages", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "shortMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "version", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "BaseError"
      });
      this.details = details;
      this.docsPath = docsPath;
      this.metaMessages = args.metaMessages;
      this.name = args.name ?? this.name;
      this.shortMessage = shortMessage;
      this.version = version;
    }
    walk(fn) {
      return walk(this, fn);
    }
  };
});

// node_modules/viem/_esm/errors/abi.js
var AbiConstructorNotFoundError, AbiConstructorParamsNotFoundError, AbiDecodingDataSizeTooSmallError, AbiDecodingZeroDataError, AbiEncodingArrayLengthMismatchError, AbiEncodingBytesSizeMismatchError, AbiEncodingLengthMismatchError, AbiErrorInputsNotFoundError, AbiErrorNotFoundError, AbiErrorSignatureNotFoundError, AbiEventSignatureEmptyTopicsError, AbiEventSignatureNotFoundError, AbiEventNotFoundError, AbiFunctionNotFoundError, AbiFunctionOutputsNotFoundError, AbiFunctionSignatureNotFoundError, AbiItemAmbiguityError, BytesSizeMismatchError, DecodeLogDataMismatch, DecodeLogTopicsMismatch, InvalidAbiEncodingTypeError, InvalidAbiDecodingTypeError, InvalidArrayError, InvalidDefinitionTypeError;
var init_abi = __esm(() => {
  init_formatAbiItem();
  init_size();
  init_base();
  AbiConstructorNotFoundError = class AbiConstructorNotFoundError extends BaseError {
    constructor({ docsPath }) {
      super([
        "A constructor was not found on the ABI.",
        "Make sure you are using the correct ABI and that the constructor exists on it."
      ].join(`
`), {
        docsPath,
        name: "AbiConstructorNotFoundError"
      });
    }
  };
  AbiConstructorParamsNotFoundError = class AbiConstructorParamsNotFoundError extends BaseError {
    constructor({ docsPath }) {
      super([
        "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
        "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
      ].join(`
`), {
        docsPath,
        name: "AbiConstructorParamsNotFoundError"
      });
    }
  };
  AbiDecodingDataSizeTooSmallError = class AbiDecodingDataSizeTooSmallError extends BaseError {
    constructor({ data, params, size: size3 }) {
      super([`Data size of ${size3} bytes is too small for given parameters.`].join(`
`), {
        metaMessages: [
          `Params: (${formatAbiParams(params, { includeName: true })})`,
          `Data:   ${data} (${size3} bytes)`
        ],
        name: "AbiDecodingDataSizeTooSmallError"
      });
      Object.defineProperty(this, "data", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "params", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "size", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.data = data;
      this.params = params;
      this.size = size3;
    }
  };
  AbiDecodingZeroDataError = class AbiDecodingZeroDataError extends BaseError {
    constructor({ cause } = {}) {
      super('Cannot decode zero data ("0x") with ABI parameters.', {
        name: "AbiDecodingZeroDataError",
        cause
      });
    }
  };
  AbiEncodingArrayLengthMismatchError = class AbiEncodingArrayLengthMismatchError extends BaseError {
    constructor({ expectedLength, givenLength, type }) {
      super([
        `ABI encoding array length mismatch for type ${type}.`,
        `Expected length: ${expectedLength}`,
        `Given length: ${givenLength}`
      ].join(`
`), { name: "AbiEncodingArrayLengthMismatchError" });
    }
  };
  AbiEncodingBytesSizeMismatchError = class AbiEncodingBytesSizeMismatchError extends BaseError {
    constructor({ expectedSize, value }) {
      super(`Size of bytes "${value}" (bytes${size2(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
    }
  };
  AbiEncodingLengthMismatchError = class AbiEncodingLengthMismatchError extends BaseError {
    constructor({ expectedLength, givenLength }) {
      super([
        "ABI encoding params/values length mismatch.",
        `Expected length (params): ${expectedLength}`,
        `Given length (values): ${givenLength}`
      ].join(`
`), { name: "AbiEncodingLengthMismatchError" });
    }
  };
  AbiErrorInputsNotFoundError = class AbiErrorInputsNotFoundError extends BaseError {
    constructor(errorName, { docsPath }) {
      super([
        `Arguments (\`args\`) were provided to "${errorName}", but "${errorName}" on the ABI does not contain any parameters (\`inputs\`).`,
        "Cannot encode error result without knowing what the parameter types are.",
        "Make sure you are using the correct ABI and that the inputs exist on it."
      ].join(`
`), {
        docsPath,
        name: "AbiErrorInputsNotFoundError"
      });
    }
  };
  AbiErrorNotFoundError = class AbiErrorNotFoundError extends BaseError {
    constructor(errorName, { docsPath } = {}) {
      super([
        `Error ${errorName ? `"${errorName}" ` : ""}not found on ABI.`,
        "Make sure you are using the correct ABI and that the error exists on it."
      ].join(`
`), {
        docsPath,
        name: "AbiErrorNotFoundError"
      });
    }
  };
  AbiErrorSignatureNotFoundError = class AbiErrorSignatureNotFoundError extends BaseError {
    constructor(signature, { docsPath, cause }) {
      super([
        `Encoded error signature "${signature}" not found on ABI.`,
        "Make sure you are using the correct ABI and that the error exists on it.",
        `You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${signature}.`
      ].join(`
`), {
        docsPath,
        name: "AbiErrorSignatureNotFoundError",
        cause
      });
      Object.defineProperty(this, "signature", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.signature = signature;
    }
  };
  AbiEventSignatureEmptyTopicsError = class AbiEventSignatureEmptyTopicsError extends BaseError {
    constructor({ docsPath }) {
      super("Cannot extract event signature from empty topics.", {
        docsPath,
        name: "AbiEventSignatureEmptyTopicsError"
      });
    }
  };
  AbiEventSignatureNotFoundError = class AbiEventSignatureNotFoundError extends BaseError {
    constructor(signature, { docsPath }) {
      super([
        `Encoded event signature "${signature}" not found on ABI.`,
        "Make sure you are using the correct ABI and that the event exists on it.",
        `You can look up the signature here: https://4byte.sourcify.dev/?q=${signature}.`
      ].join(`
`), {
        docsPath,
        name: "AbiEventSignatureNotFoundError"
      });
    }
  };
  AbiEventNotFoundError = class AbiEventNotFoundError extends BaseError {
    constructor(eventName, { docsPath } = {}) {
      super([
        `Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`,
        "Make sure you are using the correct ABI and that the event exists on it."
      ].join(`
`), {
        docsPath,
        name: "AbiEventNotFoundError"
      });
    }
  };
  AbiFunctionNotFoundError = class AbiFunctionNotFoundError extends BaseError {
    constructor(functionName, { docsPath } = {}) {
      super([
        `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
        "Make sure you are using the correct ABI and that the function exists on it."
      ].join(`
`), {
        docsPath,
        name: "AbiFunctionNotFoundError"
      });
    }
  };
  AbiFunctionOutputsNotFoundError = class AbiFunctionOutputsNotFoundError extends BaseError {
    constructor(functionName, { docsPath }) {
      super([
        `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
        "Cannot decode function result without knowing what the parameter types are.",
        "Make sure you are using the correct ABI and that the function exists on it."
      ].join(`
`), {
        docsPath,
        name: "AbiFunctionOutputsNotFoundError"
      });
    }
  };
  AbiFunctionSignatureNotFoundError = class AbiFunctionSignatureNotFoundError extends BaseError {
    constructor(signature, { docsPath }) {
      super([
        `Encoded function signature "${signature}" not found on ABI.`,
        "Make sure you are using the correct ABI and that the function exists on it.",
        `You can look up the signature here: https://4byte.sourcify.dev/?q=${signature}.`
      ].join(`
`), {
        docsPath,
        name: "AbiFunctionSignatureNotFoundError"
      });
    }
  };
  AbiItemAmbiguityError = class AbiItemAmbiguityError extends BaseError {
    constructor(x, y) {
      super("Found ambiguous types in overloaded ABI items.", {
        metaMessages: [
          `\`${x.type}\` in \`${formatAbiItem(x.abiItem)}\`, and`,
          `\`${y.type}\` in \`${formatAbiItem(y.abiItem)}\``,
          "",
          "These types encode differently and cannot be distinguished at runtime.",
          "Remove one of the ambiguous items in the ABI."
        ],
        name: "AbiItemAmbiguityError"
      });
    }
  };
  BytesSizeMismatchError = class BytesSizeMismatchError extends BaseError {
    constructor({ expectedSize, givenSize }) {
      super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
        name: "BytesSizeMismatchError"
      });
    }
  };
  DecodeLogDataMismatch = class DecodeLogDataMismatch extends BaseError {
    constructor({ abiItem, data, params, size: size3 }) {
      super([
        `Data size of ${size3} bytes is too small for non-indexed event parameters.`
      ].join(`
`), {
        metaMessages: [
          `Params: (${formatAbiParams(params, { includeName: true })})`,
          `Data:   ${data} (${size3} bytes)`
        ],
        name: "DecodeLogDataMismatch"
      });
      Object.defineProperty(this, "abiItem", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "data", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "params", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "size", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.abiItem = abiItem;
      this.data = data;
      this.params = params;
      this.size = size3;
    }
  };
  DecodeLogTopicsMismatch = class DecodeLogTopicsMismatch extends BaseError {
    constructor({ abiItem, param }) {
      super([
        `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${formatAbiItem(abiItem, { includeName: true })}".`
      ].join(`
`), { name: "DecodeLogTopicsMismatch" });
      Object.defineProperty(this, "abiItem", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.abiItem = abiItem;
    }
  };
  InvalidAbiEncodingTypeError = class InvalidAbiEncodingTypeError extends BaseError {
    constructor(type, { docsPath }) {
      super([
        `Type "${type}" is not a valid encoding type.`,
        "Please provide a valid ABI type."
      ].join(`
`), { docsPath, name: "InvalidAbiEncodingType" });
    }
  };
  InvalidAbiDecodingTypeError = class InvalidAbiDecodingTypeError extends BaseError {
    constructor(type, { docsPath }) {
      super([
        `Type "${type}" is not a valid decoding type.`,
        "Please provide a valid ABI type."
      ].join(`
`), { docsPath, name: "InvalidAbiDecodingType" });
    }
  };
  InvalidArrayError = class InvalidArrayError extends BaseError {
    constructor(value) {
      super([`Value "${value}" is not a valid array.`].join(`
`), {
        name: "InvalidArrayError"
      });
    }
  };
  InvalidDefinitionTypeError = class InvalidDefinitionTypeError extends BaseError {
    constructor(type) {
      super([
        `"${type}" is not a valid definition type.`,
        'Valid types: "function", "event", "error"'
      ].join(`
`), { name: "InvalidDefinitionTypeError" });
    }
  };
});

// node_modules/viem/_esm/errors/address.js
var InvalidAddressError;
var init_address = __esm(() => {
  init_base();
  InvalidAddressError = class InvalidAddressError extends BaseError {
    constructor({ address }) {
      super(`Address "${address}" is invalid.`, {
        metaMessages: [
          "- Address must be a hex value of 20 bytes (40 hex characters).",
          "- Address must match its checksum counterpart."
        ],
        name: "InvalidAddressError"
      });
    }
  };
});

// node_modules/viem/_esm/errors/data.js
var SliceOffsetOutOfBoundsError, SizeExceedsPaddingSizeError, InvalidBytesLengthError;
var init_data = __esm(() => {
  init_base();
  SliceOffsetOutOfBoundsError = class SliceOffsetOutOfBoundsError extends BaseError {
    constructor({ offset, position, size: size3 }) {
      super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size3}).`, { name: "SliceOffsetOutOfBoundsError" });
    }
  };
  SizeExceedsPaddingSizeError = class SizeExceedsPaddingSizeError extends BaseError {
    constructor({ size: size3, targetSize, type }) {
      super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size3}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
    }
  };
  InvalidBytesLengthError = class InvalidBytesLengthError extends BaseError {
    constructor({ size: size3, targetSize, type }) {
      super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size3} ${type} long.`, { name: "InvalidBytesLengthError" });
    }
  };
});

// node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size: size3 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size3 });
  return padBytes(hexOrBytes, { dir, size: size3 });
}
function padHex(hex_, { dir, size: size3 = 32 } = {}) {
  if (size3 === null)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size3 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size3,
      type: "hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size3 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size3 = 32 } = {}) {
  if (size3 === null)
    return bytes;
  if (bytes.length > size3)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size3,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size3);
  for (let i = 0;i < size3; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size3 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
var init_pad = __esm(() => {
  init_data();
});

// node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError, InvalidBytesBooleanError, InvalidHexBooleanError, SizeOverflowError;
var init_encoding = __esm(() => {
  init_base();
  IntegerOutOfRangeError = class IntegerOutOfRangeError extends BaseError {
    constructor({ max, min, signed, size: size3, value }) {
      super(`Number "${value}" is not in safe ${size3 ? `${size3 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
    }
  };
  InvalidBytesBooleanError = class InvalidBytesBooleanError extends BaseError {
    constructor(bytes) {
      super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
        name: "InvalidBytesBooleanError"
      });
    }
  };
  InvalidHexBooleanError = class InvalidHexBooleanError extends BaseError {
    constructor(hex) {
      super(`Hex value "${hex}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`, { name: "InvalidHexBooleanError" });
    }
  };
  SizeOverflowError = class SizeOverflowError extends BaseError {
    constructor({ givenSize, maxSize }) {
      super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
    }
  };
});

// node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
  let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
  let sliceLength = 0;
  for (let i = 0;i < data.length - 1; i++) {
    if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === "string") {
    if (data.length === 1 && dir === "right")
      data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}

// node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size3 }) {
  if (size2(hexOrBytes) > size3)
    throw new SizeOverflowError({
      givenSize: size2(hexOrBytes),
      maxSize: size3
    });
}
function hexToBigInt(hex, opts = {}) {
  const { signed } = opts;
  if (opts.size)
    assertSize(hex, { size: opts.size });
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size3 = (hex.length - 2) / 2;
  const max = (1n << BigInt(size3) * 8n - 1n) - 1n;
  if (value <= max)
    return value;
  return value - BigInt(`0x${"f".padStart(size3 * 2, "f")}`) - 1n;
}
function hexToBool(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = trim(hex);
  }
  if (trim(hex) === "0x00")
    return false;
  if (trim(hex) === "0x01")
    return true;
  throw new InvalidHexBooleanError(hex);
}
function hexToNumber(hex, opts = {}) {
  const value = hexToBigInt(hex, opts);
  const number = Number(value);
  if (!Number.isSafeInteger(number))
    throw new IntegerOutOfRangeError({
      max: `${Number.MAX_SAFE_INTEGER}`,
      min: `${Number.MIN_SAFE_INTEGER}`,
      signed: opts.signed,
      size: opts.size,
      value: `${value}n`
    });
  return number;
}
var init_fromHex = __esm(() => {
  init_encoding();
  init_size();
});

// node_modules/viem/_esm/utils/encoding/toHex.js
function toHex(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean")
    return boolToHex(value, opts);
  return bytesToHex(value, opts);
}
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { size: opts.size });
  }
  return hex;
}
function bytesToHex(value, opts = {}) {
  let string = "";
  for (let i = 0;i < value.length; i++) {
    string += hexes[value[i]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { dir: "right", size: opts.size });
  }
  return hex;
}
function numberToHex(value_, opts = {}) {
  const { signed, size: size3 } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size3) {
    if (signed)
      maxValue = (1n << BigInt(size3) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size3) * 8n) - 1n;
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : undefined,
      min: `${minValue}${suffix}`,
      signed,
      size: size3,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size3 * 8)) + BigInt(value) : value).toString(16)}`;
  if (size3)
    return pad(hex, { size: size3 });
  return hex;
}
function stringToHex(value_, opts = {}) {
  const value = encoder.encode(value_);
  return bytesToHex(value, opts);
}
var hexes, encoder;
var init_toHex = __esm(() => {
  init_encoding();
  init_pad();
  init_fromHex();
  hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
  encoder = /* @__PURE__ */ new TextEncoder;
});

// node_modules/viem/_esm/utils/encoding/toBytes.js
function toBytes(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToBytes(value, opts);
  if (typeof value === "boolean")
    return boolToBytes(value, opts);
  if (isHex(value))
    return hexToBytes(value, opts);
  return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { size: opts.size });
  }
  return bytes;
}
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine)
    return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F)
    return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f)
    return char - (charCodeMap.a - 10);
  return;
}
function hexToBytes(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = pad(hex, { dir: "right", size: opts.size });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index2 = 0, j = 0;index2 < length; index2++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === undefined || nibbleRight === undefined) {
      throw new BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index2] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function numberToBytes(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
}
function stringToBytes(value, opts = {}) {
  const bytes = encoder2.encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { dir: "right", size: opts.size });
  }
  return bytes;
}
var encoder2, charCodeMap;
var init_toBytes = __esm(() => {
  init_base();
  init_pad();
  init_fromHex();
  init_toHex();
  encoder2 = /* @__PURE__ */ new TextEncoder;
  charCodeMap = {
    zero: 48,
    nine: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102
  };
});

// node_modules/@noble/hashes/esm/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0;i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var U32_MASK64, _32n, rotlSH = (h, l, s) => h << s | l >>> 32 - s, rotlSL = (h, l, s) => l << s | h >>> 32 - s, rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s, rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
var init__u64 = __esm(() => {
  U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
  _32n = /* @__PURE__ */ BigInt(32);
});

// node_modules/@noble/hashes/esm/cryptoNode.js
import * as nc from "crypto";
var crypto2;
var init_cryptoNode = __esm(() => {
  crypto2 = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : nc && typeof nc === "object" && ("randomBytes" in nc) ? nc : undefined;
});

// node_modules/@noble/hashes/esm/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0;i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i = 0;i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0;i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad2 = 0;i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}

class Hash {
}
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto2 && typeof crypto2.getRandomValues === "function") {
    return crypto2.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto2 && typeof crypto2.randomBytes === "function") {
    return Uint8Array.from(crypto2.randomBytes(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}
var isLE, swap32IfBE;
var init_utils = __esm(() => {
  init_cryptoNode();
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
  swap32IfBE = isLE ? (u) => u : byteSwap32;
});

// node_modules/@noble/hashes/esm/sha3.js
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds;round < 24; round++) {
    for (let x = 0;x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0;x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0;y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0;t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0;y < 50; y += 10) {
      for (let x = 0;x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0;x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  clean(B);
}
var _0n, _1n, _2n, _7n, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s), rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s), Keccak, gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen)), keccak_256;
var init_sha3 = __esm(() => {
  init__u64();
  init_utils();
  _0n = BigInt(0);
  _1n = BigInt(1);
  _2n = BigInt(2);
  _7n = BigInt(7);
  _256n = BigInt(256);
  _0x71n = BigInt(113);
  SHA3_PI = [];
  SHA3_ROTL = [];
  _SHA3_IOTA = [];
  for (let round = 0, R = _1n, x = 1, y = 0;round < 24; round++) {
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
    let t = _0n;
    for (let j = 0;j < 7; j++) {
      R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
      if (R & _2n)
        t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
    }
    _SHA3_IOTA.push(t);
  }
  IOTAS = split(_SHA3_IOTA, true);
  SHA3_IOTA_H = IOTAS[0];
  SHA3_IOTA_L = IOTAS[1];
  Keccak = class Keccak extends Hash {
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
      super();
      this.pos = 0;
      this.posOut = 0;
      this.finished = false;
      this.destroyed = false;
      this.enableXOF = false;
      this.blockLen = blockLen;
      this.suffix = suffix;
      this.outputLen = outputLen;
      this.enableXOF = enableXOF;
      this.rounds = rounds;
      anumber(outputLen);
      if (!(0 < blockLen && blockLen < 200))
        throw new Error("only keccak-f1600 function is supported");
      this.state = new Uint8Array(200);
      this.state32 = u32(this.state);
    }
    clone() {
      return this._cloneInto();
    }
    keccak() {
      swap32IfBE(this.state32);
      keccakP(this.state32, this.rounds);
      swap32IfBE(this.state32);
      this.posOut = 0;
      this.pos = 0;
    }
    update(data) {
      aexists(this);
      data = toBytes2(data);
      abytes(data);
      const { blockLen, state } = this;
      const len = data.length;
      for (let pos = 0;pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        for (let i = 0;i < take; i++)
          state[this.pos++] ^= data[pos++];
        if (this.pos === blockLen)
          this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished)
        return;
      this.finished = true;
      const { state, suffix, pos, blockLen } = this;
      state[pos] ^= suffix;
      if ((suffix & 128) !== 0 && pos === blockLen - 1)
        this.keccak();
      state[blockLen - 1] ^= 128;
      this.keccak();
    }
    writeInto(out) {
      aexists(this, false);
      abytes(out);
      this.finish();
      const bufferOut = this.state;
      const { blockLen } = this;
      for (let pos = 0, len = out.length;pos < len; ) {
        if (this.posOut >= blockLen)
          this.keccak();
        const take = Math.min(blockLen - this.posOut, len - pos);
        out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
        this.posOut += take;
        pos += take;
      }
      return out;
    }
    xofInto(out) {
      if (!this.enableXOF)
        throw new Error("XOF is not possible for this instance");
      return this.writeInto(out);
    }
    xof(bytes) {
      anumber(bytes);
      return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
      aoutput(out, this);
      if (this.finished)
        throw new Error("digest() was already called");
      this.writeInto(out);
      this.destroy();
      return out;
    }
    digest() {
      return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
      this.destroyed = true;
      clean(this.state);
    }
    _cloneInto(to) {
      const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
      to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
      to.state32.set(this.state32);
      to.pos = this.pos;
      to.posOut = this.posOut;
      to.finished = this.finished;
      to.rounds = rounds;
      to.suffix = suffix;
      to.outputLen = outputLen;
      to.enableXOF = enableXOF;
      to.destroyed = this.destroyed;
      return to;
    }
  };
  keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
});

// node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
  const to = to_ || "hex";
  const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
var init_keccak256 = __esm(() => {
  init_sha3();
  init_toBytes();
  init_toHex();
});

// node_modules/viem/_esm/utils/lru.js
var LruMap;
var init_lru = __esm(() => {
  LruMap = class LruMap extends Map {
    constructor(size3) {
      super();
      Object.defineProperty(this, "maxSize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.maxSize = size3;
    }
    get(key) {
      const value = super.get(key);
      if (super.has(key)) {
        super.delete(key);
        super.set(key, value);
      }
      return value;
    }
    set(key, value) {
      if (super.has(key))
        super.delete(key);
      super.set(key, value);
      if (this.maxSize && this.size > this.maxSize) {
        const firstKey = super.keys().next().value;
        if (firstKey !== undefined)
          super.delete(firstKey);
      }
      return this;
    }
  };
});

// node_modules/viem/_esm/utils/address/isAddress.js
function isAddress(address, options) {
  const { strict = true } = options ?? {};
  const cacheKey = `${address}.${strict}`;
  if (isAddressCache.has(cacheKey))
    return isAddressCache.get(cacheKey);
  const result = (() => {
    if (!addressRegex.test(address))
      return false;
    if (address.toLowerCase() === address)
      return true;
    if (strict)
      return checksumAddress(address) === address;
    return true;
  })();
  isAddressCache.set(cacheKey, result);
  return result;
}
var addressRegex, isAddressCache;
var init_isAddress = __esm(() => {
  init_lru();
  init_getAddress();
  addressRegex = /^0x[a-fA-F0-9]{40}$/;
  isAddressCache = /* @__PURE__ */ new LruMap(8192);
});

// node_modules/viem/_esm/utils/address/getAddress.js
function checksumAddress(address_, chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`))
    return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash = keccak256(stringToBytes(hexAddress), "bytes");
  const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
  for (let i = 0;i < 40; i += 2) {
    if (hash[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash[i >> 1] & 15) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }
  const result = `0x${address.join("")}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
function getAddress(address, chainId) {
  if (!isAddress(address, { strict: false }))
    throw new InvalidAddressError({ address });
  return checksumAddress(address, chainId);
}
var checksumAddressCache;
var init_getAddress = __esm(() => {
  init_address();
  init_toBytes();
  init_keccak256();
  init_lru();
  init_isAddress();
  checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
});

// node_modules/viem/_esm/errors/cursor.js
var NegativeOffsetError, PositionOutOfBoundsError, RecursiveReadLimitExceededError;
var init_cursor = __esm(() => {
  init_base();
  NegativeOffsetError = class NegativeOffsetError extends BaseError {
    constructor({ offset }) {
      super(`Offset \`${offset}\` cannot be negative.`, {
        name: "NegativeOffsetError"
      });
    }
  };
  PositionOutOfBoundsError = class PositionOutOfBoundsError extends BaseError {
    constructor({ length, position }) {
      super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
    }
  };
  RecursiveReadLimitExceededError = class RecursiveReadLimitExceededError extends BaseError {
    constructor({ count, limit }) {
      super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
    }
  };
});

// node_modules/viem/_esm/utils/cursor.js
function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer ?? bytes, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = new Map;
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}
var staticCursor;
var init_cursor2 = __esm(() => {
  init_cursor();
  staticCursor = {
    bytes: new Uint8Array,
    dataView: new DataView(new ArrayBuffer(0)),
    position: 0,
    positionReadCount: new Map,
    recursiveReadCount: 0,
    recursiveReadLimit: Number.POSITIVE_INFINITY,
    assertReadLimit() {
      if (this.recursiveReadCount >= this.recursiveReadLimit)
        throw new RecursiveReadLimitExceededError({
          count: this.recursiveReadCount + 1,
          limit: this.recursiveReadLimit
        });
    },
    assertPosition(position) {
      if (position < 0 || position > this.bytes.length - 1)
        throw new PositionOutOfBoundsError({
          length: this.bytes.length,
          position
        });
    },
    decrementPosition(offset) {
      if (offset < 0)
        throw new NegativeOffsetError({ offset });
      const position = this.position - offset;
      this.assertPosition(position);
      this.position = position;
    },
    getReadCount(position) {
      return this.positionReadCount.get(position || this.position) || 0;
    },
    incrementPosition(offset) {
      if (offset < 0)
        throw new NegativeOffsetError({ offset });
      const position = this.position + offset;
      this.assertPosition(position);
      this.position = position;
    },
    inspectByte(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position);
      return this.bytes[position];
    },
    inspectBytes(length, position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + length - 1);
      return this.bytes.subarray(position, position + length);
    },
    inspectUint8(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position);
      return this.bytes[position];
    },
    inspectUint16(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 1);
      return this.dataView.getUint16(position);
    },
    inspectUint24(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 2);
      return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
    },
    inspectUint32(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 3);
      return this.dataView.getUint32(position);
    },
    pushByte(byte) {
      this.assertPosition(this.position);
      this.bytes[this.position] = byte;
      this.position++;
    },
    pushBytes(bytes) {
      this.assertPosition(this.position + bytes.length - 1);
      this.bytes.set(bytes, this.position);
      this.position += bytes.length;
    },
    pushUint8(value) {
      this.assertPosition(this.position);
      this.bytes[this.position] = value;
      this.position++;
    },
    pushUint16(value) {
      this.assertPosition(this.position + 1);
      this.dataView.setUint16(this.position, value);
      this.position += 2;
    },
    pushUint24(value) {
      this.assertPosition(this.position + 2);
      this.dataView.setUint16(this.position, value >> 8);
      this.dataView.setUint8(this.position + 2, value & ~4294967040);
      this.position += 3;
    },
    pushUint32(value) {
      this.assertPosition(this.position + 3);
      this.dataView.setUint32(this.position, value);
      this.position += 4;
    },
    readByte() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectByte();
      this.position++;
      return value;
    },
    readBytes(length, size3) {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectBytes(length);
      this.position += size3 ?? length;
      return value;
    },
    readUint8() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint8();
      this.position += 1;
      return value;
    },
    readUint16() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint16();
      this.position += 2;
      return value;
    },
    readUint24() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint24();
      this.position += 3;
      return value;
    },
    readUint32() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint32();
      this.position += 4;
      return value;
    },
    get remaining() {
      return this.bytes.length - this.position;
    },
    setPosition(position) {
      const oldPosition = this.position;
      this.assertPosition(position);
      this.position = position;
      return () => this.position = oldPosition;
    },
    _touch() {
      if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
        return;
      const count = this.getReadCount();
      this.positionReadCount.set(this.position, count + 1);
      if (count > 0)
        this.recursiveReadCount++;
    }
  };
});

// node_modules/viem/_esm/utils/data/slice.js
function slice(value, start, end, { strict } = {}) {
  if (isHex(value, { strict: false }))
    return sliceHex(value, start, end, {
      strict
    });
  return sliceBytes(value, start, end, {
    strict
  });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size2(value) - 1)
    throw new SliceOffsetOutOfBoundsError({
      offset: start,
      position: "start",
      size: size2(value)
    });
}
function assertEndOffset(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size2(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end,
      position: "end",
      size: size2(value)
    });
  }
}
function sliceBytes(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end);
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
function sliceHex(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
var init_slice = __esm(() => {
  init_data();
  init_size();
});

// node_modules/viem/_esm/utils/encoding/fromBytes.js
function bytesToBigInt(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes, opts);
  return hexToBigInt(hex, opts);
}
function bytesToBool(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes);
  }
  if (bytes.length > 1 || bytes[0] > 1)
    throw new InvalidBytesBooleanError(bytes);
  return Boolean(bytes[0]);
}
function bytesToNumber(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes, opts);
  return hexToNumber(hex, opts);
}
function bytesToString(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes, { dir: "right" });
  }
  return new TextDecoder().decode(bytes);
}
var init_fromBytes = __esm(() => {
  init_encoding();
  init_fromHex();
  init_toHex();
});

// node_modules/viem/_esm/utils/data/concat.js
function concat(values) {
  if (typeof values[0] === "string")
    return concatHex(values);
  return concatBytes2(values);
}
function concatBytes2(values) {
  let length = 0;
  for (const arr of values) {
    length += arr.length;
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of values) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function concatHex(values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}

// node_modules/viem/_esm/utils/regex.js
var bytesRegex, integerRegex;
var init_regex = __esm(() => {
  bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
  integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
});

// node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function encodeAbiParameters(params, values) {
  if (params.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: params.length,
      givenLength: values.length
    });
  const preparedParams = prepareParams({
    params,
    values
  });
  return encodeParams(preparedParams);
}
function prepareParams({ params, values }) {
  const preparedParams = [];
  for (let i = 0;i < params.length; i++) {
    preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
  }
  return preparedParams;
}
function prepareParam({ param, value }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, { length, param: { ...param, type } });
  }
  if (param.type === "tuple") {
    return encodeTuple(value, {
      param
    });
  }
  if (param.type === "address") {
    return encodeAddress(value);
  }
  if (param.type === "bool") {
    return encodeBool(value);
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    const signed = param.type.startsWith("int");
    const [, , size3 = "256"] = integerRegex.exec(param.type) ?? [];
    return encodeNumber(value, {
      signed,
      size: Number(size3)
    });
  }
  if (param.type.startsWith("bytes")) {
    return encodeBytes(value, { param });
  }
  if (param.type === "string") {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: "/docs/contract/encodeAbiParameters"
  });
}
function encodeParams(preparedParams) {
  let staticSize = 0;
  for (let i = 0;i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size2(encoded);
  }
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i = 0;i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
      dynamicParams.push(encoded);
      dynamicSize += size2(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  return concatHex([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value))
    throw new InvalidAddressError({ address: value });
  return { dynamic: false, encoded: padHex(value.toLowerCase()) };
}
function encodeArray(value, { length, param }) {
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length)
    throw new AbiEncodingArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${param.type}[${length}]`
    });
  let dynamicChild = value.length === 0 && isDynamicType(param);
  const preparedParams = [];
  for (let i = 0;i < value.length; i++) {
    const preparedParam = prepareParam({ param, value: value[i] });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length2 = numberToHex(preparedParams.length, { size: 32 });
      return {
        dynamic: true,
        encoded: concatHex([length2, data])
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concatHex(preparedParams.map(({ encoded }) => encoded))
  };
}
function encodeBytes(value, { param }) {
  const [, paramSize] = param.type.split("bytes");
  const bytesSize = size2(value);
  if (!paramSize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padHex(value_, {
        dir: "right",
        size: Math.ceil((value.length - 2) / 2 / 32) * 32
      });
    return {
      dynamic: true,
      encoded: concatHex([
        padHex(numberToHex(bytesSize, { size: 32 })),
        value_
      ])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize, 10))
    throw new AbiEncodingBytesSizeMismatchError({
      expectedSize: Number.parseInt(paramSize, 10),
      value
    });
  return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
}
function encodeBool(value) {
  if (typeof value !== "boolean")
    throw new BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padHex(boolToHex(value)) };
}
function encodeNumber(value, { signed, size: size3 = 256 }) {
  if (typeof size3 === "number") {
    const max = 2n ** (BigInt(size3) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size3 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size2(hexValue) / 32);
  const parts = [];
  for (let i = 0;i < partsLength; i++) {
    parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
      dir: "right"
    }));
  }
  return {
    dynamic: true,
    encoded: concatHex([
      padHex(numberToHex(size2(hexValue), { size: 32 })),
      ...parts
    ])
  };
}
function encodeTuple(value, { param }) {
  let dynamic = false;
  const preparedParams = [];
  for (let i = 0;i < param.components.length; i++) {
    const param_ = param.components[i];
    const index2 = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index2]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concatHex(preparedParams.map(({ encoded }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : undefined;
}
function isDynamicType(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components.some(isDynamicType);
  const arrayComponents = getArrayComponents(type);
  if (arrayComponents)
    return isDynamicType({ ...param, type: arrayComponents[1] });
  return false;
}
var init_encodeAbiParameters = __esm(() => {
  init_abi();
  init_address();
  init_base();
  init_encoding();
  init_isAddress();
  init_pad();
  init_size();
  init_slice();
  init_toHex();
  init_regex();
});

// node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data) {
  const bytes = typeof data === "string" ? hexToBytes(data) : data;
  const cursor = createCursor(bytes);
  if (size2(bytes) === 0 && params.length > 0)
    throw new AbiDecodingZeroDataError;
  if (size2(data) && size2(data) < 32)
    throw new AbiDecodingDataSizeTooSmallError({
      data: typeof data === "string" ? data : bytesToHex(data),
      params,
      size: size2(data)
    });
  let consumed = 0;
  const values = [];
  for (let i = 0;i < params.length; ++i) {
    const param = params[i];
    if (consumed < bytes.length)
      cursor.setPosition(consumed);
    const [data2, consumed_] = decodeParameter(cursor, param, {
      staticPosition: 0
    });
    consumed += consumed_;
    values.push(data2);
  }
  return values;
}
function decodeParameter(cursor, param, { staticPosition }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray(cursor, { ...param, type }, { length, staticPosition });
  }
  if (param.type === "tuple")
    return decodeTuple(cursor, param, { staticPosition });
  if (param.type === "address")
    return decodeAddress(cursor);
  if (param.type === "bool")
    return decodeBool(cursor);
  if (param.type.startsWith("bytes"))
    return decodeBytes(cursor, param, { staticPosition });
  if (param.type.startsWith("uint") || param.type.startsWith("int"))
    return decodeNumber(cursor, param);
  if (param.type === "string")
    return decodeString(cursor, { staticPosition });
  throw new InvalidAbiDecodingTypeError(param.type, {
    docsPath: "/docs/contract/decodeAbiParameters"
  });
}
function decodeAddress(cursor) {
  const value = cursor.readBytes(32);
  return [checksumAddress(bytesToHex(sliceBytes(value, -20))), 32];
}
function decodeArray(cursor, param, { length, staticPosition }) {
  if (length === null) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength;
    cursor.setPosition(start);
    const length2 = bytesToNumber(cursor.readBytes(sizeOfLength));
    const dynamicChild = hasDynamicChild(param);
    let consumed2 = 0;
    const value2 = [];
    for (let i = 0;i < length2; ++i) {
      cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: startOfData
      });
      consumed2 += consumed_;
      value2.push(data);
      if (consumed_ === 0) {
        cursor.assertReadLimit();
        cursor._touch();
      }
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const value2 = [];
    for (let i = 0;i < length; ++i) {
      cursor.setPosition(start + i * 32);
      const [data] = decodeParameter(cursor, param, {
        staticPosition: start
      });
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  let consumed = 0;
  const value = [];
  for (let i = 0;i < length; ++i) {
    const [data, consumed_] = decodeParameter(cursor, param, {
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
    if (consumed_ === 0) {
      cursor.assertReadLimit();
      cursor._touch();
    }
  }
  return [value, consumed];
}
function decodeBool(cursor) {
  return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
  const [_, size3] = param.type.split("bytes");
  if (!size3) {
    const offset = bytesToNumber(cursor.readBytes(32));
    cursor.setPosition(staticPosition + offset);
    const length = bytesToNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["0x", 32];
    }
    const data = cursor.readBytes(length);
    cursor.setPosition(staticPosition + 32);
    return [bytesToHex(data), 32];
  }
  const value = bytesToHex(cursor.readBytes(Number.parseInt(size3, 10), 32));
  return [value, 32];
}
function decodeNumber(cursor, param) {
  const signed = param.type.startsWith("int");
  const size3 = Number.parseInt(param.type.split("int")[1] || "256", 10);
  const value = cursor.readBytes(32);
  return [
    size3 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
    32
  ];
}
function decodeTuple(cursor, param, { staticPosition }) {
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    for (let i = 0;i < param.components.length; ++i) {
      const component = param.components[i];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i : component?.name] = data;
    }
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  for (let i = 0;i < param.components.length; ++i) {
    const component = param.components[i];
    const [data, consumed_] = decodeParameter(cursor, component, {
      staticPosition
    });
    value[hasUnnamedChild ? i : component?.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
  const offset = bytesToNumber(cursor.readBytes(32));
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = bytesToNumber(cursor.readBytes(32));
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ["", 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = bytesToString(data);
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function hasDynamicChild(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components?.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
    return true;
  return false;
}
var sizeOfLength = 32, sizeOfOffset = 32;
var init_decodeAbiParameters = __esm(() => {
  init_abi();
  init_getAddress();
  init_cursor2();
  init_size();
  init_slice();
  init_fromBytes();
  init_toBytes();
  init_toHex();
  init_encodeAbiParameters();
});

// node_modules/viem/_esm/utils/hash/hashSignature.js
function hashSignature(sig) {
  return hash(sig);
}
var hash = (value) => keccak256(toBytes(value));
var init_hashSignature = __esm(() => {
  init_toBytes();
  init_keccak256();
});

// node_modules/abitype/dist/esm/version.js
var version2 = "1.2.3";

// node_modules/abitype/dist/esm/errors.js
var BaseError2;
var init_errors = __esm(() => {
  BaseError2 = class BaseError2 extends Error {
    constructor(shortMessage, args = {}) {
      const details = args.cause instanceof BaseError2 ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
      const docsPath = args.cause instanceof BaseError2 ? args.cause.docsPath || args.docsPath : args.docsPath;
      const message = [
        shortMessage || "An error occurred.",
        "",
        ...args.metaMessages ? [...args.metaMessages, ""] : [],
        ...docsPath ? [`Docs: https://abitype.dev${docsPath}`] : [],
        ...details ? [`Details: ${details}`] : [],
        `Version: abitype@${version2}`
      ].join(`
`);
      super(message);
      Object.defineProperty(this, "details", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "docsPath", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "metaMessages", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "shortMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiTypeError"
      });
      if (args.cause)
        this.cause = args.cause;
      this.details = details;
      this.docsPath = docsPath;
      this.metaMessages = args.metaMessages;
      this.shortMessage = shortMessage;
    }
  };
});

// node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
  const match2 = regex.exec(string);
  return match2?.groups;
}
var bytesRegex2, integerRegex2, isTupleRegex;
var init_regex2 = __esm(() => {
  bytesRegex2 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
  integerRegex2 = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  isTupleRegex = /^\(.+?\).*?$/;
});

// node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
function formatAbiParameter(abiParameter) {
  let type = abiParameter.type;
  if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
    type = "(";
    const length = abiParameter.components.length;
    for (let i = 0;i < length; i++) {
      const component = abiParameter.components[i];
      type += formatAbiParameter(component);
      if (i < length - 1)
        type += ", ";
    }
    const result = execTyped(tupleRegex, abiParameter.type);
    type += `)${result?.array || ""}`;
    return formatAbiParameter({
      ...abiParameter,
      type
    });
  }
  if ("indexed" in abiParameter && abiParameter.indexed)
    type = `${type} indexed`;
  if (abiParameter.name)
    return `${type} ${abiParameter.name}`;
  return type;
}
var tupleRegex;
var init_formatAbiParameter = __esm(() => {
  init_regex2();
  tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
});

// node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
function formatAbiParameters(abiParameters) {
  let params = "";
  const length = abiParameters.length;
  for (let i = 0;i < length; i++) {
    const abiParameter = abiParameters[i];
    params += formatAbiParameter(abiParameter);
    if (i !== length - 1)
      params += ", ";
  }
  return params;
}
var init_formatAbiParameters = __esm(() => {
  init_formatAbiParameter();
});

// node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
function formatAbiItem2(abiItem) {
  if (abiItem.type === "function")
    return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
  if (abiItem.type === "event")
    return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "error")
    return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "constructor")
    return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  if (abiItem.type === "fallback")
    return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  return "receive() external payable";
}
var init_formatAbiItem2 = __esm(() => {
  init_formatAbiParameters();
});

// node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
function isErrorSignature(signature) {
  return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
  return execTyped(errorSignatureRegex, signature);
}
function isEventSignature(signature) {
  return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
  return execTyped(eventSignatureRegex, signature);
}
function isFunctionSignature(signature) {
  return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
  return execTyped(functionSignatureRegex, signature);
}
function isStructSignature(signature) {
  return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
  return execTyped(structSignatureRegex, signature);
}
function isConstructorSignature(signature) {
  return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
  return execTyped(constructorSignatureRegex, signature);
}
function isFallbackSignature(signature) {
  return fallbackSignatureRegex.test(signature);
}
function execFallbackSignature(signature) {
  return execTyped(fallbackSignatureRegex, signature);
}
function isReceiveSignature(signature) {
  return receiveSignatureRegex.test(signature);
}
var errorSignatureRegex, eventSignatureRegex, functionSignatureRegex, structSignatureRegex, constructorSignatureRegex, fallbackSignatureRegex, receiveSignatureRegex, modifiers, eventModifiers, functionModifiers;
var init_signatures = __esm(() => {
  init_regex2();
  errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
  eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
  functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
  structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
  constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
  fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
  receiveSignatureRegex = /^receive\(\) external payable$/;
  modifiers = new Set([
    "memory",
    "indexed",
    "storage",
    "calldata"
  ]);
  eventModifiers = new Set(["indexed"]);
  functionModifiers = new Set([
    "calldata",
    "memory",
    "storage"
  ]);
});

// node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var InvalidAbiItemError, UnknownTypeError, UnknownSolidityTypeError;
var init_abiItem = __esm(() => {
  init_errors();
  InvalidAbiItemError = class InvalidAbiItemError extends BaseError2 {
    constructor({ signature }) {
      super("Failed to parse ABI item.", {
        details: `parseAbiItem(${JSON.stringify(signature, null, 2)})`,
        docsPath: "/api/human#parseabiitem-1"
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "InvalidAbiItemError"
      });
    }
  };
  UnknownTypeError = class UnknownTypeError extends BaseError2 {
    constructor({ type }) {
      super("Unknown type.", {
        metaMessages: [
          `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "UnknownTypeError"
      });
    }
  };
  UnknownSolidityTypeError = class UnknownSolidityTypeError extends BaseError2 {
    constructor({ type }) {
      super("Unknown type.", {
        metaMessages: [`Type "${type}" is not a valid ABI type.`]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "UnknownSolidityTypeError"
      });
    }
  };
});

// node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidAbiParametersError, InvalidParameterError, SolidityProtectedKeywordError, InvalidModifierError, InvalidFunctionModifierError, InvalidAbiTypeParameterError;
var init_abiParameter = __esm(() => {
  init_errors();
  InvalidAbiParametersError = class InvalidAbiParametersError extends BaseError2 {
    constructor({ params }) {
      super("Failed to parse ABI parameters.", {
        details: `parseAbiParameters(${JSON.stringify(params, null, 2)})`,
        docsPath: "/api/human#parseabiparameters-1"
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "InvalidAbiParametersError"
      });
    }
  };
  InvalidParameterError = class InvalidParameterError extends BaseError2 {
    constructor({ param }) {
      super("Invalid ABI parameter.", {
        details: param
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "InvalidParameterError"
      });
    }
  };
  SolidityProtectedKeywordError = class SolidityProtectedKeywordError extends BaseError2 {
    constructor({ param, name }) {
      super("Invalid ABI parameter.", {
        details: param,
        metaMessages: [
          `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "SolidityProtectedKeywordError"
      });
    }
  };
  InvalidModifierError = class InvalidModifierError extends BaseError2 {
    constructor({ param, type, modifier }) {
      super("Invalid ABI parameter.", {
        details: param,
        metaMessages: [
          `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "InvalidModifierError"
      });
    }
  };
  InvalidFunctionModifierError = class InvalidFunctionModifierError extends BaseError2 {
    constructor({ param, type, modifier }) {
      super("Invalid ABI parameter.", {
        details: param,
        metaMessages: [
          `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
          `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "InvalidFunctionModifierError"
      });
    }
  };
  InvalidAbiTypeParameterError = class InvalidAbiTypeParameterError extends BaseError2 {
    constructor({ abiParameter }) {
      super("Invalid ABI parameter.", {
        details: JSON.stringify(abiParameter, null, 2),
        metaMessages: ["ABI parameter type is invalid."]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "InvalidAbiTypeParameterError"
      });
    }
  };
});

// node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError, UnknownSignatureError, InvalidStructSignatureError;
var init_signature = __esm(() => {
  init_errors();
  InvalidSignatureError = class InvalidSignatureError extends BaseError2 {
    constructor({ signature, type }) {
      super(`Invalid ${type} signature.`, {
        details: signature
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "InvalidSignatureError"
      });
    }
  };
  UnknownSignatureError = class UnknownSignatureError extends BaseError2 {
    constructor({ signature }) {
      super("Unknown signature.", {
        details: signature
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "UnknownSignatureError"
      });
    }
  };
  InvalidStructSignatureError = class InvalidStructSignatureError extends BaseError2 {
    constructor({ signature }) {
      super("Invalid struct signature.", {
        details: signature,
        metaMessages: ["No properties exist."]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "InvalidStructSignatureError"
      });
    }
  };
});

// node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError;
var init_struct = __esm(() => {
  init_errors();
  CircularReferenceError = class CircularReferenceError extends BaseError2 {
    constructor({ type }) {
      super("Circular reference detected.", {
        metaMessages: [`Struct "${type}" is a circular reference.`]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "CircularReferenceError"
      });
    }
  };
});

// node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError;
var init_splitParameters = __esm(() => {
  init_errors();
  InvalidParenthesisError = class InvalidParenthesisError extends BaseError2 {
    constructor({ current, depth }) {
      super("Unbalanced parentheses.", {
        metaMessages: [
          `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
        ],
        details: `Depth "${depth}"`
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "InvalidParenthesisError"
      });
    }
  };
});

// node_modules/abitype/dist/esm/human-readable/runtime/cache.js
function getParameterCacheKey(param, type, structs) {
  let structKey = "";
  if (structs)
    for (const struct of Object.entries(structs)) {
      if (!struct)
        continue;
      let propertyKey = "";
      for (const property of struct[1]) {
        propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
      }
      structKey += `(${struct[0]}{${propertyKey}})`;
    }
  if (type)
    return `${type}:${param}${structKey}`;
  return `${param}${structKey}`;
}
var parameterCache;
var init_cache = __esm(() => {
  parameterCache = new Map([
    ["address", { type: "address" }],
    ["bool", { type: "bool" }],
    ["bytes", { type: "bytes" }],
    ["bytes32", { type: "bytes32" }],
    ["int", { type: "int256" }],
    ["int256", { type: "int256" }],
    ["string", { type: "string" }],
    ["uint", { type: "uint256" }],
    ["uint8", { type: "uint8" }],
    ["uint16", { type: "uint16" }],
    ["uint24", { type: "uint24" }],
    ["uint32", { type: "uint32" }],
    ["uint64", { type: "uint64" }],
    ["uint96", { type: "uint96" }],
    ["uint112", { type: "uint112" }],
    ["uint160", { type: "uint160" }],
    ["uint192", { type: "uint192" }],
    ["uint256", { type: "uint256" }],
    ["address owner", { type: "address", name: "owner" }],
    ["address to", { type: "address", name: "to" }],
    ["bool approved", { type: "bool", name: "approved" }],
    ["bytes _data", { type: "bytes", name: "_data" }],
    ["bytes data", { type: "bytes", name: "data" }],
    ["bytes signature", { type: "bytes", name: "signature" }],
    ["bytes32 hash", { type: "bytes32", name: "hash" }],
    ["bytes32 r", { type: "bytes32", name: "r" }],
    ["bytes32 root", { type: "bytes32", name: "root" }],
    ["bytes32 s", { type: "bytes32", name: "s" }],
    ["string name", { type: "string", name: "name" }],
    ["string symbol", { type: "string", name: "symbol" }],
    ["string tokenURI", { type: "string", name: "tokenURI" }],
    ["uint tokenId", { type: "uint256", name: "tokenId" }],
    ["uint8 v", { type: "uint8", name: "v" }],
    ["uint256 balance", { type: "uint256", name: "balance" }],
    ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
    ["uint256 value", { type: "uint256", name: "value" }],
    [
      "event:address indexed from",
      { type: "address", name: "from", indexed: true }
    ],
    ["event:address indexed to", { type: "address", name: "to", indexed: true }],
    [
      "event:uint indexed tokenId",
      { type: "uint256", name: "tokenId", indexed: true }
    ],
    [
      "event:uint256 indexed tokenId",
      { type: "uint256", name: "tokenId", indexed: true }
    ]
  ]);
});

// node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature(signature, structs = {}) {
  if (isFunctionSignature(signature))
    return parseFunctionSignature(signature, structs);
  if (isEventSignature(signature))
    return parseEventSignature(signature, structs);
  if (isErrorSignature(signature))
    return parseErrorSignature(signature, structs);
  if (isConstructorSignature(signature))
    return parseConstructorSignature(signature, structs);
  if (isFallbackSignature(signature))
    return parseFallbackSignature(signature);
  if (isReceiveSignature(signature))
    return {
      type: "receive",
      stateMutability: "payable"
    };
  throw new UnknownSignatureError({ signature });
}
function parseFunctionSignature(signature, structs = {}) {
  const match2 = execFunctionSignature(signature);
  if (!match2)
    throw new InvalidSignatureError({ signature, type: "function" });
  const inputParams = splitParameters(match2.parameters);
  const inputs = [];
  const inputLength = inputParams.length;
  for (let i = 0;i < inputLength; i++) {
    inputs.push(parseAbiParameter(inputParams[i], {
      modifiers: functionModifiers,
      structs,
      type: "function"
    }));
  }
  const outputs = [];
  if (match2.returns) {
    const outputParams = splitParameters(match2.returns);
    const outputLength = outputParams.length;
    for (let i = 0;i < outputLength; i++) {
      outputs.push(parseAbiParameter(outputParams[i], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
  }
  return {
    name: match2.name,
    type: "function",
    stateMutability: match2.stateMutability ?? "nonpayable",
    inputs,
    outputs
  };
}
function parseEventSignature(signature, structs = {}) {
  const match2 = execEventSignature(signature);
  if (!match2)
    throw new InvalidSignatureError({ signature, type: "event" });
  const params = splitParameters(match2.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i = 0;i < length; i++)
    abiParameters.push(parseAbiParameter(params[i], {
      modifiers: eventModifiers,
      structs,
      type: "event"
    }));
  return { name: match2.name, type: "event", inputs: abiParameters };
}
function parseErrorSignature(signature, structs = {}) {
  const match2 = execErrorSignature(signature);
  if (!match2)
    throw new InvalidSignatureError({ signature, type: "error" });
  const params = splitParameters(match2.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i = 0;i < length; i++)
    abiParameters.push(parseAbiParameter(params[i], { structs, type: "error" }));
  return { name: match2.name, type: "error", inputs: abiParameters };
}
function parseConstructorSignature(signature, structs = {}) {
  const match2 = execConstructorSignature(signature);
  if (!match2)
    throw new InvalidSignatureError({ signature, type: "constructor" });
  const params = splitParameters(match2.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i = 0;i < length; i++)
    abiParameters.push(parseAbiParameter(params[i], { structs, type: "constructor" }));
  return {
    type: "constructor",
    stateMutability: match2.stateMutability ?? "nonpayable",
    inputs: abiParameters
  };
}
function parseFallbackSignature(signature) {
  const match2 = execFallbackSignature(signature);
  if (!match2)
    throw new InvalidSignatureError({ signature, type: "fallback" });
  return {
    type: "fallback",
    stateMutability: match2.stateMutability ?? "nonpayable"
  };
}
function parseAbiParameter(param, options) {
  const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey);
  const isTuple = isTupleRegex.test(param);
  const match2 = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
  if (!match2)
    throw new InvalidParameterError({ param });
  if (match2.name && isSolidityKeyword(match2.name))
    throw new SolidityProtectedKeywordError({ param, name: match2.name });
  const name = match2.name ? { name: match2.name } : {};
  const indexed = match2.modifier === "indexed" ? { indexed: true } : {};
  const structs = options?.structs ?? {};
  let type;
  let components = {};
  if (isTuple) {
    type = "tuple";
    const params = splitParameters(match2.type);
    const components_ = [];
    const length = params.length;
    for (let i = 0;i < length; i++) {
      components_.push(parseAbiParameter(params[i], { structs }));
    }
    components = { components: components_ };
  } else if (match2.type in structs) {
    type = "tuple";
    components = { components: structs[match2.type] };
  } else if (dynamicIntegerRegex.test(match2.type)) {
    type = `${match2.type}256`;
  } else if (match2.type === "address payable") {
    type = "address";
  } else {
    type = match2.type;
    if (!(options?.type === "struct") && !isSolidityType(type))
      throw new UnknownSolidityTypeError({ type });
  }
  if (match2.modifier) {
    if (!options?.modifiers?.has?.(match2.modifier))
      throw new InvalidModifierError({
        param,
        type: options?.type,
        modifier: match2.modifier
      });
    if (functionModifiers.has(match2.modifier) && !isValidDataLocation(type, !!match2.array))
      throw new InvalidFunctionModifierError({
        param,
        type: options?.type,
        modifier: match2.modifier
      });
  }
  const abiParameter = {
    type: `${type}${match2.array ?? ""}`,
    ...name,
    ...indexed,
    ...components
  };
  parameterCache.set(parameterCacheKey, abiParameter);
  return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
  const length = params.trim().length;
  for (let i = 0;i < length; i++) {
    const char = params[i];
    const tail = params.slice(i + 1);
    switch (char) {
      case ",":
        return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
      case "(":
        return splitParameters(tail, result, `${current}${char}`, depth + 1);
      case ")":
        return splitParameters(tail, result, `${current}${char}`, depth - 1);
      default:
        return splitParameters(tail, result, `${current}${char}`, depth);
    }
  }
  if (current === "")
    return result;
  if (depth !== 0)
    throw new InvalidParenthesisError({ current, depth });
  result.push(current.trim());
  return result;
}
function isSolidityType(type) {
  return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex2.test(type) || integerRegex2.test(type);
}
function isSolidityKeyword(name) {
  return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex2.test(name) || integerRegex2.test(name) || protectedKeywordsRegex.test(name);
}
function isValidDataLocation(type, isArray) {
  return isArray || type === "bytes" || type === "string" || type === "tuple";
}
var abiParameterWithoutTupleRegex, abiParameterWithTupleRegex, dynamicIntegerRegex, protectedKeywordsRegex;
var init_utils2 = __esm(() => {
  init_regex2();
  init_abiItem();
  init_abiParameter();
  init_signature();
  init_splitParameters();
  init_cache();
  init_signatures();
  abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
  abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
  dynamicIntegerRegex = /^u?int$/;
  protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
});

// node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures) {
  const shallowStructs = {};
  const signaturesLength = signatures.length;
  for (let i = 0;i < signaturesLength; i++) {
    const signature = signatures[i];
    if (!isStructSignature(signature))
      continue;
    const match2 = execStructSignature(signature);
    if (!match2)
      throw new InvalidSignatureError({ signature, type: "struct" });
    const properties = match2.properties.split(";");
    const components = [];
    const propertiesLength = properties.length;
    for (let k = 0;k < propertiesLength; k++) {
      const property = properties[k];
      const trimmed = property.trim();
      if (!trimmed)
        continue;
      const abiParameter = parseAbiParameter(trimmed, {
        type: "struct"
      });
      components.push(abiParameter);
    }
    if (!components.length)
      throw new InvalidStructSignatureError({ signature });
    shallowStructs[match2.name] = components;
  }
  const resolvedStructs = {};
  const entries = Object.entries(shallowStructs);
  const entriesLength = entries.length;
  for (let i = 0;i < entriesLength; i++) {
    const [name, parameters] = entries[i];
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
  }
  return resolvedStructs;
}
function resolveStructs(abiParameters = [], structs = {}, ancestors = new Set) {
  const components = [];
  const length = abiParameters.length;
  for (let i = 0;i < length; i++) {
    const abiParameter = abiParameters[i];
    const isTuple = isTupleRegex.test(abiParameter.type);
    if (isTuple)
      components.push(abiParameter);
    else {
      const match2 = execTyped(typeWithoutTupleRegex, abiParameter.type);
      if (!match2?.type)
        throw new InvalidAbiTypeParameterError({ abiParameter });
      const { array, type } = match2;
      if (type in structs) {
        if (ancestors.has(type))
          throw new CircularReferenceError({ type });
        components.push({
          ...abiParameter,
          type: `tuple${array ?? ""}`,
          components: resolveStructs(structs[type], structs, new Set([...ancestors, type]))
        });
      } else {
        if (isSolidityType(type))
          components.push(abiParameter);
        else
          throw new UnknownTypeError({ type });
      }
    }
  }
  return components;
}
var typeWithoutTupleRegex;
var init_structs = __esm(() => {
  init_regex2();
  init_abiItem();
  init_abiParameter();
  init_signature();
  init_struct();
  init_signatures();
  init_utils2();
  typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
});

// node_modules/abitype/dist/esm/human-readable/parseAbi.js
function parseAbi(signatures) {
  const structs = parseStructs(signatures);
  const abi = [];
  const length = signatures.length;
  for (let i = 0;i < length; i++) {
    const signature = signatures[i];
    if (isStructSignature(signature))
      continue;
    abi.push(parseSignature(signature, structs));
  }
  return abi;
}
var init_parseAbi = __esm(() => {
  init_signatures();
  init_structs();
  init_utils2();
});

// node_modules/abitype/dist/esm/human-readable/parseAbiItem.js
function parseAbiItem(signature) {
  let abiItem;
  if (typeof signature === "string")
    abiItem = parseSignature(signature);
  else {
    const structs = parseStructs(signature);
    const length = signature.length;
    for (let i = 0;i < length; i++) {
      const signature_ = signature[i];
      if (isStructSignature(signature_))
        continue;
      abiItem = parseSignature(signature_, structs);
      break;
    }
  }
  if (!abiItem)
    throw new InvalidAbiItemError({ signature });
  return abiItem;
}
var init_parseAbiItem = __esm(() => {
  init_abiItem();
  init_signatures();
  init_structs();
  init_utils2();
});

// node_modules/abitype/dist/esm/human-readable/parseAbiParameters.js
function parseAbiParameters(params) {
  const abiParameters = [];
  if (typeof params === "string") {
    const parameters = splitParameters(params);
    const length = parameters.length;
    for (let i = 0;i < length; i++) {
      abiParameters.push(parseAbiParameter(parameters[i], { modifiers }));
    }
  } else {
    const structs = parseStructs(params);
    const length = params.length;
    for (let i = 0;i < length; i++) {
      const signature = params[i];
      if (isStructSignature(signature))
        continue;
      const parameters = splitParameters(signature);
      const length2 = parameters.length;
      for (let k = 0;k < length2; k++) {
        abiParameters.push(parseAbiParameter(parameters[k], { modifiers, structs }));
      }
    }
  }
  if (abiParameters.length === 0)
    throw new InvalidAbiParametersError({ params });
  return abiParameters;
}
var init_parseAbiParameters = __esm(() => {
  init_abiParameter();
  init_signatures();
  init_structs();
  init_utils2();
  init_utils2();
});

// node_modules/abitype/dist/esm/exports/index.js
var init_exports = __esm(() => {
  init_formatAbiItem2();
  init_formatAbiParameters();
  init_parseAbi();
  init_parseAbiItem();
  init_parseAbiParameters();
});

// node_modules/viem/_esm/utils/hash/normalizeSignature.js
function normalizeSignature(signature) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i = 0;i < signature.length; i++) {
    const char = signature[i];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError("Unable to normalize signature.");
  return result;
}
var init_normalizeSignature = __esm(() => {
  init_base();
});

// node_modules/viem/_esm/utils/hash/toSignature.js
var toSignature = (def) => {
  const def_ = (() => {
    if (typeof def === "string")
      return def;
    return formatAbiItem2(def);
  })();
  return normalizeSignature(def_);
};
var init_toSignature = __esm(() => {
  init_exports();
  init_normalizeSignature();
});

// node_modules/viem/_esm/utils/hash/toSignatureHash.js
function toSignatureHash(fn) {
  return hashSignature(toSignature(fn));
}
var init_toSignatureHash = __esm(() => {
  init_hashSignature();
  init_toSignature();
});

// node_modules/viem/_esm/utils/hash/toEventSelector.js
var toEventSelector;
var init_toEventSelector = __esm(() => {
  init_toSignatureHash();
  toEventSelector = toSignatureHash;
});

// node_modules/viem/_esm/utils/hash/toFunctionSelector.js
var toFunctionSelector = (fn) => slice(toSignatureHash(fn), 0, 4);
var init_toFunctionSelector = __esm(() => {
  init_slice();
  init_toSignatureHash();
});

// node_modules/viem/_esm/utils/abi/getAbiItem.js
function getAbiItem(parameters) {
  const { abi, args = [], name } = parameters;
  const isSelector = isHex(name, { strict: false });
  const abiItems = abi.filter((abiItem) => {
    if (isSelector) {
      if (abiItem.type === "function")
        return toFunctionSelector(abiItem) === name;
      if (abiItem.type === "event")
        return toEventSelector(abiItem) === name;
      return false;
    }
    return "name" in abiItem && abiItem.name === name;
  });
  if (abiItems.length === 0)
    return;
  if (abiItems.length === 1)
    return abiItems[0];
  let matchedAbiItem;
  for (const abiItem of abiItems) {
    if (!("inputs" in abiItem))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem.inputs || abiItem.inputs.length === 0)
        return abiItem;
      continue;
    }
    if (!abiItem.inputs)
      continue;
    if (abiItem.inputs.length === 0)
      continue;
    if (abiItem.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index2) => {
      const abiParameter = "inputs" in abiItem && abiItem.inputs[index2];
      if (!abiParameter)
        return false;
      return isArgOfType(arg, abiParameter);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AbiItemAmbiguityError({
            abiItem,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem;
    }
  }
  if (matchedAbiItem)
    return matchedAbiItem;
  return abiItems[0];
}
function isArgOfType(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case "address":
      return isAddress(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter)
        return Object.values(abiParameter.components).every((component, index2) => {
          return argType === "object" && isArgOfType(Object.values(arg)[index2], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
          ...abiParameter,
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes("address") && types.includes("bytes20"))
        return true;
      if (types.includes("address") && types.includes("string"))
        return isAddress(args[parameterIndex], { strict: false });
      if (types.includes("address") && types.includes("bytes"))
        return isAddress(args[parameterIndex], { strict: false });
      return false;
    })();
    if (ambiguous)
      return types;
  }
  return;
}
var init_getAbiItem = __esm(() => {
  init_abi();
  init_isAddress();
  init_toEventSelector();
  init_toFunctionSelector();
});

// node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
function decodeFunctionResult(parameters) {
  const { abi, args, functionName, data } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({ abi, args, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(undefined, { docsPath });
  if (!abiItem.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath });
  const values = decodeAbiParameters(abiItem.outputs, data);
  if (values && values.length > 1)
    return values;
  if (values && values.length === 1)
    return values[0];
  return;
}
var docsPath = "/docs/contract/decodeFunctionResult";
var init_decodeFunctionResult = __esm(() => {
  init_abi();
  init_decodeAbiParameters();
  init_getAbiItem();
});

// node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
function prepareEncodeFunctionData(parameters) {
  const { abi, args, functionName } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({
      abi,
      args,
      name: functionName
    });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath2 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(undefined, { docsPath: docsPath2 });
  return {
    abi: [abiItem],
    functionName: toFunctionSelector(formatAbiItem(abiItem))
  };
}
var docsPath2 = "/docs/contract/encodeFunctionData";
var init_prepareEncodeFunctionData = __esm(() => {
  init_abi();
  init_toFunctionSelector();
  init_formatAbiItem();
  init_getAbiItem();
});

// node_modules/viem/_esm/utils/abi/encodeFunctionData.js
function encodeFunctionData(parameters) {
  const { args } = parameters;
  const { abi, functionName } = (() => {
    if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x"))
      return parameters;
    return prepareEncodeFunctionData(parameters);
  })();
  const abiItem = abi[0];
  const signature = functionName;
  const data = "inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : undefined;
  return concatHex([signature, data ?? "0x"]);
}
var init_encodeFunctionData = __esm(() => {
  init_encodeAbiParameters();
  init_prepareEncodeFunctionData();
});

// node_modules/viem/_esm/errors/chain.js
var ChainDoesNotSupportContract, ClientChainNotConfiguredError;
var init_chain = __esm(() => {
  init_base();
  ChainDoesNotSupportContract = class ChainDoesNotSupportContract extends BaseError {
    constructor({ blockNumber, chain, contract }) {
      super(`Chain "${chain.name}" does not support contract "${contract.name}".`, {
        metaMessages: [
          "This could be due to any of the following:",
          ...blockNumber && contract.blockCreated && contract.blockCreated > blockNumber ? [
            `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`
          ] : [
            `- The chain does not have the contract "${contract.name}" configured.`
          ]
        ],
        name: "ChainDoesNotSupportContract"
      });
    }
  };
  ClientChainNotConfiguredError = class ClientChainNotConfiguredError extends BaseError {
    constructor() {
      super("No chain was provided to the Client.", {
        name: "ClientChainNotConfiguredError"
      });
    }
  };
});

// node_modules/viem/_esm/utils/chain/getChainContractAddress.js
function getChainContractAddress({ blockNumber, chain, contract: name }) {
  const contract = chain?.contracts?.[name];
  if (!contract)
    throw new ChainDoesNotSupportContract({
      chain,
      contract: { name }
    });
  if (blockNumber && contract.blockCreated && contract.blockCreated > blockNumber)
    throw new ChainDoesNotSupportContract({
      blockNumber,
      chain,
      contract: {
        name,
        blockCreated: contract.blockCreated
      }
    });
  return contract.address;
}
var init_getChainContractAddress = __esm(() => {
  init_chain();
});

// node_modules/viem/_esm/constants/solidity.js
var panicReasons, solidityError, solidityPanic;
var init_solidity = __esm(() => {
  panicReasons = {
    1: "An `assert` condition failed.",
    17: "Arithmetic operation resulted in underflow or overflow.",
    18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
    33: "Attempted to convert to an invalid type.",
    34: "Attempted to access a storage byte array that is incorrectly encoded.",
    49: "Performed `.pop()` on an empty array",
    50: "Array index is out of bounds.",
    65: "Allocated too much memory or created an array which is too large.",
    81: "Attempted to call a zero-initialized variable of internal function type."
  };
  solidityError = {
    inputs: [
      {
        name: "message",
        type: "string"
      }
    ],
    name: "Error",
    type: "error"
  };
  solidityPanic = {
    inputs: [
      {
        name: "reason",
        type: "uint256"
      }
    ],
    name: "Panic",
    type: "error"
  };
});

// node_modules/viem/_esm/utils/abi/decodeErrorResult.js
function decodeErrorResult(parameters) {
  const { abi, data, cause } = parameters;
  const signature = slice(data, 0, 4);
  if (signature === "0x")
    throw new AbiDecodingZeroDataError({ cause });
  const abi_ = [...abi || [], solidityError, solidityPanic];
  const abiItem = abi_.find((x) => x.type === "error" && signature === toFunctionSelector(formatAbiItem(x)));
  if (!abiItem)
    throw new AbiErrorSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeErrorResult",
      cause
    });
  return {
    abiItem,
    args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? decodeAbiParameters(abiItem.inputs, slice(data, 4)) : undefined,
    errorName: abiItem.name
  };
}
var init_decodeErrorResult = __esm(() => {
  init_solidity();
  init_abi();
  init_slice();
  init_toFunctionSelector();
  init_decodeAbiParameters();
  init_formatAbiItem();
});

// node_modules/viem/_esm/utils/stringify.js
var stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
  const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
  return typeof replacer === "function" ? replacer(key, value2) : value2;
}, space);

// node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js
function formatAbiItemWithArgs({ abiItem, args, includeFunctionName = true, includeName = false }) {
  if (!("name" in abiItem))
    return;
  if (!("inputs" in abiItem))
    return;
  if (!abiItem.inputs)
    return;
  return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? stringify(args[i]) : args[i]}`).join(", ")})`;
}
var init_formatAbiItemWithArgs = () => {};

// node_modules/viem/_esm/utils/unit/Value.js
function format(value, decimals = 0) {
  if (!Number.isInteger(decimals) || decimals < 0)
    throw new InvalidDecimalsError({ decimals });
  let display = value.toString();
  const negative = display.startsWith("-");
  if (negative)
    display = display.slice(1);
  display = display.padStart(decimals, "0");
  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals)
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
function formatEther(wei, unit = "wei") {
  return format(wei, exponents.ether - exponents[unit]);
}
function formatGwei(wei, unit = "wei") {
  return format(wei, exponents.gwei - exponents[unit]);
}
var exponents, InvalidDecimalsError;
var init_Value = __esm(() => {
  exponents = {
    wei: 0,
    gwei: 9,
    szabo: 12,
    finney: 15,
    ether: 18
  };
  InvalidDecimalsError = class InvalidDecimalsError extends Error {
    constructor({ decimals }) {
      super(`\`decimals\` must be a non-negative integer. Got \`${decimals}\`.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Value.InvalidDecimalsError"
      });
    }
  };
});

// node_modules/viem/_esm/utils/unit/formatEther.js
function formatEther2(wei, unit = "wei") {
  return formatEther(wei, unit);
}
var init_formatEther = __esm(() => {
  init_Value();
});

// node_modules/viem/_esm/utils/unit/formatGwei.js
function formatGwei2(wei, unit = "wei") {
  return formatGwei(wei, unit);
}
var init_formatGwei = __esm(() => {
  init_Value();
});

// node_modules/viem/_esm/errors/stateOverride.js
function prettyStateMapping(stateMapping) {
  return stateMapping.reduce((pretty, { slot, value }) => {
    return `${pretty}        ${slot}: ${value}
`;
  }, "");
}
function prettyStateOverride(stateOverride) {
  return stateOverride.reduce((pretty, { address, ...state }) => {
    let val = `${pretty}    ${address}:
`;
    if (state.nonce)
      val += `      nonce: ${state.nonce}
`;
    if (state.balance)
      val += `      balance: ${state.balance}
`;
    if (state.code)
      val += `      code: ${state.code}
`;
    if (state.state) {
      val += `      state:
`;
      val += prettyStateMapping(state.state);
    }
    if (state.stateDiff) {
      val += `      stateDiff:
`;
      val += prettyStateMapping(state.stateDiff);
    }
    return val;
  }, `  State Override:
`).slice(0, -1);
}
var AccountStateConflictError, StateAssignmentConflictError;
var init_stateOverride = __esm(() => {
  init_base();
  AccountStateConflictError = class AccountStateConflictError extends BaseError {
    constructor({ address }) {
      super(`State for account "${address}" is set multiple times.`, {
        name: "AccountStateConflictError"
      });
    }
  };
  StateAssignmentConflictError = class StateAssignmentConflictError extends BaseError {
    constructor() {
      super("state and stateDiff are set on the same account.", {
        name: "StateAssignmentConflictError"
      });
    }
  };
});

// node_modules/viem/_esm/errors/transaction.js
function prettyPrint(args) {
  const entries = Object.entries(args).map(([key, value]) => {
    if (value === undefined || value === false)
      return null;
    return [key, value];
  }).filter(Boolean);
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
  return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join(`
`);
}
var InvalidSerializableTransactionError, TransactionExecutionError, TransactionNotFoundError, TransactionReceiptNotFoundError, TransactionReceiptRevertedError, WaitForTransactionReceiptTimeoutError;
var init_transaction = __esm(() => {
  init_formatEther();
  init_formatGwei();
  init_base();
  InvalidSerializableTransactionError = class InvalidSerializableTransactionError extends BaseError {
    constructor({ transaction }) {
      super("Cannot infer a transaction type from provided transaction.", {
        metaMessages: [
          "Provided Transaction:",
          "{",
          prettyPrint(transaction),
          "}",
          "",
          "To infer the type, either provide:",
          "- a `type` to the Transaction, or",
          "- an EIP-1559 Transaction with `maxFeePerGas`, or",
          "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
          "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
          "- an EIP-7702 Transaction with `authorizationList`, or",
          "- a Legacy Transaction with `gasPrice`"
        ],
        name: "InvalidSerializableTransactionError"
      });
    }
  };
  TransactionExecutionError = class TransactionExecutionError extends BaseError {
    constructor(cause, { account, docsPath: docsPath3, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
      const prettyArgs = prettyPrint({
        chain: chain && `${chain?.name} (id: ${chain?.id})`,
        from: account?.address,
        to,
        value: typeof value !== "undefined" && `${formatEther2(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
        data,
        gas,
        gasPrice: typeof gasPrice !== "undefined" && `${formatGwei2(gasPrice)} gwei`,
        maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei2(maxFeePerGas)} gwei`,
        maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei2(maxPriorityFeePerGas)} gwei`,
        nonce
      });
      super(cause.shortMessage, {
        cause,
        docsPath: docsPath3,
        metaMessages: [
          ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
          "Request Arguments:",
          prettyArgs
        ].filter(Boolean),
        name: "TransactionExecutionError"
      });
      Object.defineProperty(this, "cause", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.cause = cause;
    }
  };
  TransactionNotFoundError = class TransactionNotFoundError extends BaseError {
    constructor({ blockHash, blockNumber, blockTag, hash: hash2, index: index2 }) {
      let identifier = "Transaction";
      if (blockTag && index2 !== undefined)
        identifier = `Transaction at block time "${blockTag}" at index "${index2}"`;
      if (blockHash && index2 !== undefined)
        identifier = `Transaction at block hash "${blockHash}" at index "${index2}"`;
      if (blockNumber && index2 !== undefined)
        identifier = `Transaction at block number "${blockNumber}" at index "${index2}"`;
      if (hash2)
        identifier = `Transaction with hash "${hash2}"`;
      super(`${identifier} could not be found.`, {
        name: "TransactionNotFoundError"
      });
    }
  };
  TransactionReceiptNotFoundError = class TransactionReceiptNotFoundError extends BaseError {
    constructor({ hash: hash2 }) {
      super(`Transaction receipt with hash "${hash2}" could not be found. The Transaction may not be processed on a block yet.`, {
        name: "TransactionReceiptNotFoundError"
      });
    }
  };
  TransactionReceiptRevertedError = class TransactionReceiptRevertedError extends BaseError {
    constructor({ receipt }) {
      super(`Transaction with hash "${receipt.transactionHash}" reverted.`, {
        metaMessages: [
          'The receipt marked the transaction as "reverted". This could mean that the function on the contract you are trying to call threw an error.',
          " ",
          "You can attempt to extract the revert reason by:",
          "- calling the `simulateContract` or `simulateCalls` Action with the `abi` and `functionName` of the contract",
          "- using the `call` Action with raw `data`"
        ],
        name: "TransactionReceiptRevertedError"
      });
      Object.defineProperty(this, "receipt", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.receipt = receipt;
    }
  };
  WaitForTransactionReceiptTimeoutError = class WaitForTransactionReceiptTimeoutError extends BaseError {
    constructor({ hash: hash2 }) {
      super(`Timed out while waiting for transaction with hash "${hash2}" to be confirmed.`, { name: "WaitForTransactionReceiptTimeoutError" });
    }
  };
});

// node_modules/viem/_esm/errors/utils.js
function getAbortError(signal) {
  if (signal?.reason)
    return signal.reason;
  if (typeof DOMException === "function")
    return new DOMException("This operation was aborted", "AbortError");
  const error = new Error("This operation was aborted");
  error.name = "AbortError";
  return error;
}
function isAbortError(error) {
  return typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
}
var getContractAddress = (address) => address, getUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (!parsed.username && !parsed.password)
      return url;
    parsed.username = "";
    parsed.password = "";
    return parsed.toString();
  } catch {
    return url;
  }
};

// node_modules/viem/_esm/errors/contract.js
var CallExecutionError, ContractFunctionExecutionError, ContractFunctionRevertedError, ContractFunctionZeroDataError, CounterfactualDeploymentFailedError, RawContractError;
var init_contract = __esm(() => {
  init_solidity();
  init_decodeErrorResult();
  init_formatAbiItem();
  init_formatAbiItemWithArgs();
  init_getAbiItem();
  init_formatEther();
  init_formatGwei();
  init_abi();
  init_base();
  init_stateOverride();
  init_transaction();
  CallExecutionError = class CallExecutionError extends BaseError {
    constructor(cause, { account: account_, docsPath: docsPath3, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride }) {
      const account = account_ ? parseAccount(account_) : undefined;
      let prettyArgs = prettyPrint({
        from: account?.address,
        to,
        value: typeof value !== "undefined" && `${formatEther2(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
        data,
        gas,
        gasPrice: typeof gasPrice !== "undefined" && `${formatGwei2(gasPrice)} gwei`,
        maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei2(maxFeePerGas)} gwei`,
        maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei2(maxPriorityFeePerGas)} gwei`,
        nonce
      });
      if (stateOverride) {
        prettyArgs += `
${prettyStateOverride(stateOverride)}`;
      }
      super(cause.shortMessage, {
        cause,
        docsPath: docsPath3,
        metaMessages: [
          ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
          "Raw Call Arguments:",
          prettyArgs
        ].filter(Boolean),
        name: "CallExecutionError"
      });
      Object.defineProperty(this, "cause", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.cause = cause;
    }
  };
  ContractFunctionExecutionError = class ContractFunctionExecutionError extends BaseError {
    constructor(cause, { abi, args, contractAddress, docsPath: docsPath3, functionName, sender }) {
      const abiItem = getAbiItem({ abi, args, name: functionName });
      const formattedArgs = abiItem ? formatAbiItemWithArgs({
        abiItem,
        args,
        includeFunctionName: false,
        includeName: false
      }) : undefined;
      const functionWithParams = abiItem ? formatAbiItem(abiItem, { includeName: true }) : undefined;
      const prettyArgs = prettyPrint({
        address: contractAddress && getContractAddress(contractAddress),
        function: functionWithParams,
        args: formattedArgs && formattedArgs !== "()" && `${[...Array(functionName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
        sender
      });
      super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
        cause,
        docsPath: docsPath3,
        metaMessages: [
          ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
          prettyArgs && "Contract Call:",
          prettyArgs
        ].filter(Boolean),
        name: "ContractFunctionExecutionError"
      });
      Object.defineProperty(this, "abi", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "args", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "cause", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "contractAddress", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "formattedArgs", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "functionName", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "sender", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.abi = abi;
      this.args = args;
      this.cause = cause;
      this.contractAddress = contractAddress;
      this.functionName = functionName;
      this.sender = sender;
    }
  };
  ContractFunctionRevertedError = class ContractFunctionRevertedError extends BaseError {
    constructor({ abi, data, functionName, message, cause: error }) {
      let cause;
      let decodedData;
      let metaMessages;
      let reason;
      if (data && data !== "0x") {
        try {
          decodedData = decodeErrorResult({ abi, data, cause: error });
          const { abiItem, errorName, args: errorArgs } = decodedData;
          if (errorName === "Error") {
            reason = errorArgs[0];
          } else if (errorName === "Panic") {
            const [firstArg] = errorArgs;
            reason = panicReasons[firstArg];
          } else {
            const errorWithParams = abiItem ? formatAbiItem(abiItem, { includeName: true }) : undefined;
            const formattedArgs = abiItem && errorArgs ? formatAbiItemWithArgs({
              abiItem,
              args: errorArgs,
              includeFunctionName: false,
              includeName: false
            }) : undefined;
            metaMessages = [
              errorWithParams ? `Error: ${errorWithParams}` : "",
              formattedArgs && formattedArgs !== "()" ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
            ];
          }
        } catch (err) {
          cause = err;
        }
      } else if (message)
        reason = message;
      let signature;
      if (cause instanceof AbiErrorSignatureNotFoundError) {
        signature = cause.signature;
        metaMessages = [
          `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
          "Make sure you are using the correct ABI and that the error exists on it.",
          `You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${signature}.`
        ];
      }
      super(reason && reason !== "execution reverted" || signature ? [
        `The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`,
        reason || signature
      ].join(`
`) : `The contract function "${functionName}" reverted.`, {
        cause: cause ?? error,
        metaMessages,
        name: "ContractFunctionRevertedError"
      });
      Object.defineProperty(this, "data", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "raw", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "reason", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "signature", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.data = decodedData;
      this.raw = data;
      this.reason = reason;
      this.signature = signature;
    }
  };
  ContractFunctionZeroDataError = class ContractFunctionZeroDataError extends BaseError {
    constructor({ functionName, cause }) {
      super(`The contract function "${functionName}" returned no data ("0x").`, {
        metaMessages: [
          "This could be due to any of the following:",
          `  - The contract does not have the function "${functionName}",`,
          "  - The parameters passed to the contract function may be invalid, or",
          "  - The address is not a contract."
        ],
        name: "ContractFunctionZeroDataError",
        cause
      });
    }
  };
  CounterfactualDeploymentFailedError = class CounterfactualDeploymentFailedError extends BaseError {
    constructor({ factory }) {
      super(`Deployment for counterfactual contract call failed${factory ? ` for factory "${factory}".` : ""}`, {
        metaMessages: [
          "Please ensure:",
          "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
          "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
        ],
        name: "CounterfactualDeploymentFailedError"
      });
    }
  };
  RawContractError = class RawContractError extends BaseError {
    constructor({ data, message }) {
      super(message || "", { name: "RawContractError" });
      Object.defineProperty(this, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 3
      });
      Object.defineProperty(this, "data", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.data = data;
    }
  };
});

// node_modules/viem/_esm/utils/abi/decodeFunctionData.js
function decodeFunctionData(parameters) {
  const { abi, data } = parameters;
  const signature = slice(data, 0, 4);
  const description = abi.find((x) => x.type === "function" && signature === toFunctionSelector(formatAbiItem(x)));
  if (!description)
    throw new AbiFunctionSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeFunctionData"
    });
  return {
    functionName: description.name,
    args: "inputs" in description && description.inputs && description.inputs.length > 0 ? decodeAbiParameters(description.inputs, slice(data, 4)) : undefined
  };
}
var init_decodeFunctionData = __esm(() => {
  init_abi();
  init_slice();
  init_toFunctionSelector();
  init_decodeAbiParameters();
  init_formatAbiItem();
});

// node_modules/viem/_esm/utils/abi/encodeErrorResult.js
function encodeErrorResult(parameters) {
  const { abi, errorName, args } = parameters;
  let abiItem = abi[0];
  if (errorName) {
    const item = getAbiItem({ abi, args, name: errorName });
    if (!item)
      throw new AbiErrorNotFoundError(errorName, { docsPath: docsPath3 });
    abiItem = item;
  }
  if (abiItem.type !== "error")
    throw new AbiErrorNotFoundError(undefined, { docsPath: docsPath3 });
  const definition = formatAbiItem(abiItem);
  const signature = toFunctionSelector(definition);
  let data = "0x";
  if (args && args.length > 0) {
    if (!abiItem.inputs)
      throw new AbiErrorInputsNotFoundError(abiItem.name, { docsPath: docsPath3 });
    data = encodeAbiParameters(abiItem.inputs, args);
  }
  return concatHex([signature, data]);
}
var docsPath3 = "/docs/contract/encodeErrorResult";
var init_encodeErrorResult = __esm(() => {
  init_abi();
  init_toFunctionSelector();
  init_encodeAbiParameters();
  init_formatAbiItem();
  init_getAbiItem();
});

// node_modules/viem/_esm/utils/abi/encodeFunctionResult.js
function encodeFunctionResult(parameters) {
  const { abi, functionName, result } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({ abi, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath4 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(undefined, { docsPath: docsPath4 });
  if (!abiItem.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath4 });
  const values = (() => {
    if (abiItem.outputs.length === 0)
      return [];
    if (abiItem.outputs.length === 1)
      return [result];
    if (Array.isArray(result))
      return result;
    throw new InvalidArrayError(result);
  })();
  return encodeAbiParameters(abiItem.outputs, values);
}
var docsPath4 = "/docs/contract/encodeFunctionResult";
var init_encodeFunctionResult = __esm(() => {
  init_abi();
  init_encodeAbiParameters();
  init_getAbiItem();
});

// node_modules/viem/_esm/utils/ens/localBatchGatewayRequest.js
async function localBatchGatewayRequest(parameters) {
  const { data, ccipRequest } = parameters;
  const { args: [queries] } = decodeFunctionData({ abi: batchGatewayAbi, data });
  const failures = [];
  const responses = [];
  await Promise.all(queries.map(async (query, i) => {
    try {
      responses[i] = query.urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({ data: query.data, ccipRequest }) : await ccipRequest(query);
      failures[i] = false;
    } catch (err) {
      failures[i] = true;
      responses[i] = encodeError(err);
    }
  }));
  return encodeFunctionResult({
    abi: batchGatewayAbi,
    functionName: "query",
    result: [failures, responses]
  });
}
function encodeError(error) {
  if (error.name === "HttpRequestError" && error.status)
    return encodeErrorResult({
      abi: batchGatewayAbi,
      errorName: "HttpError",
      args: [error.status, error.shortMessage]
    });
  return encodeErrorResult({
    abi: [solidityError],
    errorName: "Error",
    args: ["shortMessage" in error ? error.shortMessage : error.message]
  });
}
var localBatchGatewayUrl = "x-batch-gateway:true";
var init_localBatchGatewayRequest = __esm(() => {
  init_abis();
  init_solidity();
  init_decodeFunctionData();
  init_encodeErrorResult();
  init_encodeFunctionResult();
});

// node_modules/viem/_esm/errors/request.js
var HttpRequestError, ResponseBodyTooLargeError, RpcRequestError, TimeoutError;
var init_request = __esm(() => {
  init_base();
  HttpRequestError = class HttpRequestError extends BaseError {
    constructor({ body, cause, details, headers, status, url }) {
      super("HTTP request failed.", {
        cause,
        details,
        metaMessages: [
          status && `Status: ${status}`,
          `URL: ${getUrl(url)}`,
          body && `Request body: ${stringify(body)}`
        ].filter(Boolean),
        name: "HttpRequestError"
      });
      Object.defineProperty(this, "body", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "headers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "status", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "url", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.body = body;
      this.headers = headers;
      this.status = status;
      this.url = url;
    }
  };
  ResponseBodyTooLargeError = class ResponseBodyTooLargeError extends BaseError {
    constructor({ maxSize, size: size3 }) {
      super("HTTP response body exceeded the size limit.", {
        metaMessages: [`Max: ${maxSize} bytes`, `Received: ${size3} bytes`],
        name: "ResponseBodyTooLargeError"
      });
      Object.defineProperty(this, "maxSize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "size", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.maxSize = maxSize;
      this.size = size3;
    }
  };
  RpcRequestError = class RpcRequestError extends BaseError {
    constructor({ body, error, url }) {
      super("RPC Request failed.", {
        cause: error,
        details: error.message,
        metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
        name: "RpcRequestError"
      });
      Object.defineProperty(this, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "data", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "url", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.code = error.code;
      this.data = error.data;
      this.url = url;
    }
  };
  TimeoutError = class TimeoutError extends BaseError {
    constructor({ body, url }) {
      super("The request took too long to respond.", {
        details: "The request timed out.",
        metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
        name: "TimeoutError"
      });
      Object.defineProperty(this, "url", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.url = url;
    }
  };
});

// node_modules/viem/_esm/errors/rpc.js
var unknownErrorCode = -1, RpcError, ProviderRpcError, ParseRpcError, InvalidRequestRpcError, MethodNotFoundRpcError, InvalidParamsRpcError, InternalRpcError, InvalidInputRpcError, ResourceNotFoundRpcError, ResourceUnavailableRpcError, TransactionRejectedRpcError, MethodNotSupportedRpcError, LimitExceededRpcError, JsonRpcVersionUnsupportedError, UserRejectedRequestError, UnauthorizedProviderError, UnsupportedProviderMethodError, ProviderDisconnectedError, ChainDisconnectedError, SwitchChainError, UnsupportedNonOptionalCapabilityError, UnsupportedChainIdError, DuplicateIdError, UnknownBundleIdError, BundleTooLargeError, AtomicReadyWalletRejectedUpgradeError, AtomicityNotSupportedError, WalletConnectSessionSettlementError, UnknownRpcError;
var init_rpc = __esm(() => {
  init_base();
  init_request();
  RpcError = class RpcError extends BaseError {
    constructor(cause, { code, docsPath: docsPath5, metaMessages, name, shortMessage }) {
      super(shortMessage, {
        cause,
        docsPath: docsPath5,
        metaMessages: metaMessages || cause?.metaMessages,
        name: name || "RpcError"
      });
      Object.defineProperty(this, "code", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.name = name || cause.name;
      this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
    }
  };
  ProviderRpcError = class ProviderRpcError extends RpcError {
    constructor(cause, options) {
      super(cause, options);
      Object.defineProperty(this, "data", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.data = options.data;
    }
  };
  ParseRpcError = class ParseRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: ParseRpcError.code,
        name: "ParseRpcError",
        shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
      });
    }
  };
  Object.defineProperty(ParseRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32700
  });
  InvalidRequestRpcError = class InvalidRequestRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: InvalidRequestRpcError.code,
        name: "InvalidRequestRpcError",
        shortMessage: "JSON is not a valid request object."
      });
    }
  };
  Object.defineProperty(InvalidRequestRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32600
  });
  MethodNotFoundRpcError = class MethodNotFoundRpcError extends RpcError {
    constructor(cause, { method } = {}) {
      super(cause, {
        code: MethodNotFoundRpcError.code,
        name: "MethodNotFoundRpcError",
        shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
      });
    }
  };
  Object.defineProperty(MethodNotFoundRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32601
  });
  InvalidParamsRpcError = class InvalidParamsRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: InvalidParamsRpcError.code,
        name: "InvalidParamsRpcError",
        shortMessage: [
          "Invalid parameters were provided to the RPC method.",
          "Double check you have provided the correct parameters."
        ].join(`
`)
      });
    }
  };
  Object.defineProperty(InvalidParamsRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32602
  });
  InternalRpcError = class InternalRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: InternalRpcError.code,
        name: "InternalRpcError",
        shortMessage: "An internal error was received."
      });
    }
  };
  Object.defineProperty(InternalRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32603
  });
  InvalidInputRpcError = class InvalidInputRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: InvalidInputRpcError.code,
        name: "InvalidInputRpcError",
        shortMessage: [
          "Missing or invalid parameters.",
          "Double check you have provided the correct parameters."
        ].join(`
`)
      });
    }
  };
  Object.defineProperty(InvalidInputRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32000
  });
  ResourceNotFoundRpcError = class ResourceNotFoundRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: ResourceNotFoundRpcError.code,
        name: "ResourceNotFoundRpcError",
        shortMessage: "Requested resource not found."
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "ResourceNotFoundRpcError"
      });
    }
  };
  Object.defineProperty(ResourceNotFoundRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32001
  });
  ResourceUnavailableRpcError = class ResourceUnavailableRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: ResourceUnavailableRpcError.code,
        name: "ResourceUnavailableRpcError",
        shortMessage: "Requested resource not available."
      });
    }
  };
  Object.defineProperty(ResourceUnavailableRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32002
  });
  TransactionRejectedRpcError = class TransactionRejectedRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: TransactionRejectedRpcError.code,
        name: "TransactionRejectedRpcError",
        shortMessage: "Transaction creation failed."
      });
    }
  };
  Object.defineProperty(TransactionRejectedRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32003
  });
  MethodNotSupportedRpcError = class MethodNotSupportedRpcError extends RpcError {
    constructor(cause, { method } = {}) {
      super(cause, {
        code: MethodNotSupportedRpcError.code,
        name: "MethodNotSupportedRpcError",
        shortMessage: `Method${method ? ` "${method}"` : ""} is not supported.`
      });
    }
  };
  Object.defineProperty(MethodNotSupportedRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32004
  });
  LimitExceededRpcError = class LimitExceededRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: LimitExceededRpcError.code,
        name: "LimitExceededRpcError",
        shortMessage: "Request exceeds defined limit."
      });
    }
  };
  Object.defineProperty(LimitExceededRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32005
  });
  JsonRpcVersionUnsupportedError = class JsonRpcVersionUnsupportedError extends RpcError {
    constructor(cause) {
      super(cause, {
        code: JsonRpcVersionUnsupportedError.code,
        name: "JsonRpcVersionUnsupportedError",
        shortMessage: "Version of JSON-RPC protocol is not supported."
      });
    }
  };
  Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32006
  });
  UserRejectedRequestError = class UserRejectedRequestError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: UserRejectedRequestError.code,
        name: "UserRejectedRequestError",
        shortMessage: "User rejected the request."
      });
    }
  };
  Object.defineProperty(UserRejectedRequestError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4001
  });
  UnauthorizedProviderError = class UnauthorizedProviderError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: UnauthorizedProviderError.code,
        name: "UnauthorizedProviderError",
        shortMessage: "The requested method and/or account has not been authorized by the user."
      });
    }
  };
  Object.defineProperty(UnauthorizedProviderError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4100
  });
  UnsupportedProviderMethodError = class UnsupportedProviderMethodError extends ProviderRpcError {
    constructor(cause, { method } = {}) {
      super(cause, {
        code: UnsupportedProviderMethodError.code,
        name: "UnsupportedProviderMethodError",
        shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
      });
    }
  };
  Object.defineProperty(UnsupportedProviderMethodError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4200
  });
  ProviderDisconnectedError = class ProviderDisconnectedError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: ProviderDisconnectedError.code,
        name: "ProviderDisconnectedError",
        shortMessage: "The Provider is disconnected from all chains."
      });
    }
  };
  Object.defineProperty(ProviderDisconnectedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4900
  });
  ChainDisconnectedError = class ChainDisconnectedError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: ChainDisconnectedError.code,
        name: "ChainDisconnectedError",
        shortMessage: "The Provider is not connected to the requested chain."
      });
    }
  };
  Object.defineProperty(ChainDisconnectedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4901
  });
  SwitchChainError = class SwitchChainError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: SwitchChainError.code,
        name: "SwitchChainError",
        shortMessage: "An error occurred when attempting to switch chain."
      });
    }
  };
  Object.defineProperty(SwitchChainError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4902
  });
  UnsupportedNonOptionalCapabilityError = class UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: UnsupportedNonOptionalCapabilityError.code,
        name: "UnsupportedNonOptionalCapabilityError",
        shortMessage: "This Wallet does not support a capability that was not marked as optional."
      });
    }
  };
  Object.defineProperty(UnsupportedNonOptionalCapabilityError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5700
  });
  UnsupportedChainIdError = class UnsupportedChainIdError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: UnsupportedChainIdError.code,
        name: "UnsupportedChainIdError",
        shortMessage: "This Wallet does not support the requested chain ID."
      });
    }
  };
  Object.defineProperty(UnsupportedChainIdError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5710
  });
  DuplicateIdError = class DuplicateIdError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: DuplicateIdError.code,
        name: "DuplicateIdError",
        shortMessage: "There is already a bundle submitted with this ID."
      });
    }
  };
  Object.defineProperty(DuplicateIdError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5720
  });
  UnknownBundleIdError = class UnknownBundleIdError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: UnknownBundleIdError.code,
        name: "UnknownBundleIdError",
        shortMessage: "This bundle id is unknown / has not been submitted"
      });
    }
  };
  Object.defineProperty(UnknownBundleIdError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5730
  });
  BundleTooLargeError = class BundleTooLargeError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: BundleTooLargeError.code,
        name: "BundleTooLargeError",
        shortMessage: "The call bundle is too large for the Wallet to process."
      });
    }
  };
  Object.defineProperty(BundleTooLargeError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5740
  });
  AtomicReadyWalletRejectedUpgradeError = class AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: AtomicReadyWalletRejectedUpgradeError.code,
        name: "AtomicReadyWalletRejectedUpgradeError",
        shortMessage: "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."
      });
    }
  };
  Object.defineProperty(AtomicReadyWalletRejectedUpgradeError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5750
  });
  AtomicityNotSupportedError = class AtomicityNotSupportedError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: AtomicityNotSupportedError.code,
        name: "AtomicityNotSupportedError",
        shortMessage: "The wallet does not support atomic execution but the request requires it."
      });
    }
  };
  Object.defineProperty(AtomicityNotSupportedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5760
  });
  WalletConnectSessionSettlementError = class WalletConnectSessionSettlementError extends ProviderRpcError {
    constructor(cause) {
      super(cause, {
        code: WalletConnectSessionSettlementError.code,
        name: "WalletConnectSessionSettlementError",
        shortMessage: "WalletConnect session settlement failed."
      });
    }
  };
  Object.defineProperty(WalletConnectSessionSettlementError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 7000
  });
  UnknownRpcError = class UnknownRpcError extends RpcError {
    constructor(cause) {
      super(cause, {
        name: "UnknownRpcError",
        shortMessage: "An unknown RPC error occurred."
      });
    }
  };
});

// node_modules/@noble/curves/esm/abstract/utils.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes2(item) {
  if (!isBytes2(item))
    throw new Error("Uint8Array expected");
}
function abool(title, value) {
  if (typeof value !== "boolean")
    throw new Error(title + " boolean expected, got " + value);
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n2 : BigInt("0x" + hex);
}
function bytesToHex2(bytes) {
  abytes2(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i = 0;i < bytes.length; i++) {
    hex += hexes2[bytes[i]];
  }
  return hex;
}
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0;ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === undefined || n2 === undefined) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function bytesToNumberBE(bytes) {
  return hexToNumber2(bytesToHex2(bytes));
}
function bytesToNumberLE(bytes) {
  abytes2(bytes);
  return hexToNumber2(bytesToHex2(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes2(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes2(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
function concatBytes3(...arrays) {
  let sum = 0;
  for (let i = 0;i < arrays.length; i++) {
    const a = arrays[i];
    abytes2(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad2 = 0;i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0;n > _0n2; n >>= _1n2, len += 1)
    ;
  return len;
}
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n(0)) => {
    k = h(u8fr([0]), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8fr([1]), seed);
    v = h();
  };
  const gen2 = () => {
    if (i++ >= 1000)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes3(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = undefined;
    while (!(res = pred(gen2())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error("invalid validator function");
    const val = object[fieldName];
    if (isOptional && val === undefined)
      return;
    if (!checkVal(val, object)) {
      throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
    }
  };
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}
function memoized(fn) {
  const map = new WeakMap;
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== undefined)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}
var _0n2, _1n2, hasHexBuiltin, hexes2, asciis, isPosBig = (n) => typeof n === "bigint" && _0n2 <= n, bitMask = (n) => (_1n2 << BigInt(n)) - _1n2, u8n = (len) => new Uint8Array(len), u8fr = (arr) => Uint8Array.from(arr), validatorFns;
var init_utils3 = __esm(() => {
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  _0n2 = /* @__PURE__ */ BigInt(0);
  _1n2 = /* @__PURE__ */ BigInt(1);
  hasHexBuiltin = typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function";
  hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
  asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  validatorFns = {
    bigint: (val) => typeof val === "bigint",
    function: (val) => typeof val === "function",
    boolean: (val) => typeof val === "boolean",
    string: (val) => typeof val === "string",
    stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
    isSafeInteger: (val) => Number.isSafeInteger(val),
    array: (val) => Array.isArray(val),
    field: (val, object) => object.Fp.isValid(val),
    hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
  };
});

// node_modules/ox/_esm/core/version.js
var version3 = "0.1.1";

// node_modules/ox/_esm/core/internal/errors.js
function getVersion() {
  return version3;
}
var init_errors2 = () => {};

// node_modules/ox/_esm/core/Errors.js
function walk2(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause)
    return walk2(err.cause, fn);
  return fn ? null : err;
}
var BaseError3;
var init_Errors = __esm(() => {
  init_errors2();
  BaseError3 = class BaseError3 extends Error {
    static setStaticOptions(options) {
      BaseError3.prototype.docsOrigin = options.docsOrigin;
      BaseError3.prototype.showVersion = options.showVersion;
      BaseError3.prototype.version = options.version;
    }
    constructor(shortMessage, options = {}) {
      const details = (() => {
        if (options.cause instanceof BaseError3) {
          if (options.cause.details)
            return options.cause.details;
          if (options.cause.shortMessage)
            return options.cause.shortMessage;
        }
        if (options.cause && "details" in options.cause && typeof options.cause.details === "string")
          return options.cause.details;
        if (options.cause?.message)
          return options.cause.message;
        return options.details;
      })();
      const docsPath5 = (() => {
        if (options.cause instanceof BaseError3)
          return options.cause.docsPath || options.docsPath;
        return options.docsPath;
      })();
      const docsBaseUrl = options.docsOrigin ?? BaseError3.prototype.docsOrigin;
      const docs = `${docsBaseUrl}${docsPath5 ?? ""}`;
      const showVersion = Boolean(options.version ?? BaseError3.prototype.showVersion);
      const version4 = options.version ?? BaseError3.prototype.version;
      const message = [
        shortMessage || "An error occurred.",
        ...options.metaMessages ? ["", ...options.metaMessages] : [],
        ...details || docsPath5 || showVersion ? [
          "",
          details ? `Details: ${details}` : undefined,
          docsPath5 ? `See: ${docs}` : undefined,
          showVersion ? `Version: ${version4}` : undefined
        ] : []
      ].filter((x) => typeof x === "string").join(`
`);
      super(message, options.cause ? { cause: options.cause } : undefined);
      Object.defineProperty(this, "details", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "docs", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "docsOrigin", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "docsPath", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "shortMessage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "showVersion", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "version", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "cause", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "BaseError"
      });
      this.cause = options.cause;
      this.details = details;
      this.docs = docs;
      this.docsOrigin = docsBaseUrl;
      this.docsPath = docsPath5;
      this.shortMessage = shortMessage;
      this.showVersion = showVersion;
      this.version = version4;
    }
    walk(fn) {
      return walk2(this, fn);
    }
  };
  Object.defineProperty(BaseError3, "defaultStaticOptions", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
      docsOrigin: "https://oxlib.sh",
      showVersion: false,
      version: `ox@${getVersion()}`
    }
  });
  (() => {
    BaseError3.setStaticOptions(BaseError3.defaultStaticOptions);
  })();
});

// node_modules/ox/_esm/core/internal/bytes.js
function assertSize2(bytes, size_) {
  if (size3(bytes) > size_)
    throw new SizeOverflowError2({
      givenSize: size3(bytes),
      maxSize: size_
    });
}
function assertStartOffset2(value, start) {
  if (typeof start === "number" && start > 0 && start > size3(value) - 1)
    throw new SliceOffsetOutOfBoundsError2({
      offset: start,
      position: "start",
      size: size3(value)
    });
}
function assertEndOffset2(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size3(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError2({
      offset: end,
      position: "end",
      size: size3(value)
    });
  }
}
function charCodeToBase162(char) {
  if (char >= charCodeMap2.zero && char <= charCodeMap2.nine)
    return char - charCodeMap2.zero;
  if (char >= charCodeMap2.A && char <= charCodeMap2.F)
    return char - (charCodeMap2.A - 10);
  if (char >= charCodeMap2.a && char <= charCodeMap2.f)
    return char - (charCodeMap2.a - 10);
  return;
}
function pad2(bytes, options = {}) {
  const { dir, size: size4 = 32 } = options;
  if (size4 === 0)
    return bytes;
  if (bytes.length > size4)
    throw new SizeExceedsPaddingSizeError2({
      size: bytes.length,
      targetSize: size4,
      type: "Bytes"
    });
  const paddedBytes = new Uint8Array(size4);
  for (let i = 0;i < size4; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size4 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
function trim2(value, options = {}) {
  const { dir = "left" } = options;
  let data = value;
  let sliceLength = 0;
  for (let i = 0;i < data.length - 1; i++) {
    if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  return data;
}
var charCodeMap2;
var init_bytes = __esm(() => {
  init_Bytes();
  charCodeMap2 = {
    zero: 48,
    nine: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102
  };
});

// node_modules/ox/_esm/core/internal/hex.js
function assertSize3(hex, size_) {
  if (size4(hex) > size_)
    throw new SizeOverflowError3({
      givenSize: size4(hex),
      maxSize: size_
    });
}
function assertStartOffset3(value, start) {
  if (typeof start === "number" && start > 0 && start > size4(value) - 1)
    throw new SliceOffsetOutOfBoundsError3({
      offset: start,
      position: "start",
      size: size4(value)
    });
}
function assertEndOffset3(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size4(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError3({
      offset: end,
      position: "end",
      size: size4(value)
    });
  }
}
function pad3(hex_, options = {}) {
  const { dir, size: size5 = 32 } = options;
  if (size5 === 0)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size5 * 2)
    throw new SizeExceedsPaddingSizeError3({
      size: Math.ceil(hex.length / 2),
      targetSize: size5,
      type: "Hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size5 * 2, "0")}`;
}
function trim3(value, options = {}) {
  const { dir = "left" } = options;
  let data = value.replace("0x", "");
  let sliceLength = 0;
  for (let i = 0;i < data.length - 1; i++) {
    if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (data === "0")
    return "0x";
  if (dir === "right" && data.length % 2 === 1)
    return `0x${data}0`;
  return `0x${data}`;
}
var init_hex = __esm(() => {
  init_Hex();
});

// node_modules/ox/_esm/core/Json.js
function stringify2(value, replacer, space) {
  return JSON.stringify(value, (key, value2) => {
    if (typeof replacer === "function")
      return replacer(key, value2);
    if (typeof value2 === "bigint")
      return value2.toString() + bigIntSuffix;
    return value2;
  }, space);
}
var bigIntSuffix = "#__bigint";

// node_modules/ox/_esm/core/Bytes.js
function assert(value) {
  if (value instanceof Uint8Array)
    return;
  if (!value)
    throw new InvalidBytesTypeError(value);
  if (typeof value !== "object")
    throw new InvalidBytesTypeError(value);
  if (!("BYTES_PER_ELEMENT" in value))
    throw new InvalidBytesTypeError(value);
  if (value.BYTES_PER_ELEMENT !== 1 || value.constructor.name !== "Uint8Array")
    throw new InvalidBytesTypeError(value);
}
function from(value) {
  if (value instanceof Uint8Array)
    return value;
  if (typeof value === "string")
    return fromHex(value);
  return fromArray(value);
}
function fromArray(value) {
  return value instanceof Uint8Array ? value : new Uint8Array(value);
}
function fromHex(value, options = {}) {
  const { size: size5 } = options;
  let hex = value;
  if (size5) {
    assertSize3(value, size5);
    hex = padRight(value, size5);
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index2 = 0, j = 0;index2 < length; index2++) {
    const nibbleLeft = charCodeToBase162(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase162(hexString.charCodeAt(j++));
    if (nibbleLeft === undefined || nibbleRight === undefined) {
      throw new BaseError3(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index2] = nibbleLeft << 4 | nibbleRight;
  }
  return bytes;
}
function fromString(value, options = {}) {
  const { size: size5 } = options;
  const bytes = encoder3.encode(value);
  if (typeof size5 === "number") {
    assertSize2(bytes, size5);
    return padRight2(bytes, size5);
  }
  return bytes;
}
function padRight2(value, size5) {
  return pad2(value, { dir: "right", size: size5 });
}
function size3(value) {
  return value.length;
}
function slice2(value, start, end, options = {}) {
  const { strict } = options;
  assertStartOffset2(value, start);
  const value_ = value.slice(start, end);
  if (strict)
    assertEndOffset2(value_, start, end);
  return value_;
}
function toBigInt2(bytes, options = {}) {
  const { size: size5 } = options;
  if (typeof size5 !== "undefined")
    assertSize2(bytes, size5);
  const hex = fromBytes(bytes, options);
  return toBigInt(hex, options);
}
function toBoolean(bytes, options = {}) {
  const { size: size5 } = options;
  let bytes_ = bytes;
  if (typeof size5 !== "undefined") {
    assertSize2(bytes_, size5);
    bytes_ = trimLeft(bytes_);
  }
  if (bytes_.length > 1 || bytes_[0] > 1)
    throw new InvalidBytesBooleanError2(bytes_);
  return Boolean(bytes_[0]);
}
function toNumber2(bytes, options = {}) {
  const { size: size5 } = options;
  if (typeof size5 !== "undefined")
    assertSize2(bytes, size5);
  const hex = fromBytes(bytes, options);
  return toNumber(hex, options);
}
function toString(bytes, options = {}) {
  const { size: size5 } = options;
  let bytes_ = bytes;
  if (typeof size5 !== "undefined") {
    assertSize2(bytes_, size5);
    bytes_ = trimRight(bytes_);
  }
  return decoder.decode(bytes_);
}
function trimLeft(value) {
  return trim2(value, { dir: "left" });
}
function trimRight(value) {
  return trim2(value, { dir: "right" });
}
function validate(value) {
  try {
    assert(value);
    return true;
  } catch {
    return false;
  }
}
var decoder, encoder3, InvalidBytesBooleanError2, InvalidBytesTypeError, SizeOverflowError2, SliceOffsetOutOfBoundsError2, SizeExceedsPaddingSizeError2;
var init_Bytes = __esm(() => {
  init_Errors();
  init_Hex();
  init_bytes();
  init_hex();
  decoder = /* @__PURE__ */ new TextDecoder;
  encoder3 = /* @__PURE__ */ new TextEncoder;
  InvalidBytesBooleanError2 = class InvalidBytesBooleanError2 extends BaseError3 {
    constructor(bytes) {
      super(`Bytes value \`${bytes}\` is not a valid boolean.`, {
        metaMessages: [
          "The bytes array must contain a single byte of either a `0` or `1` value."
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Bytes.InvalidBytesBooleanError"
      });
    }
  };
  InvalidBytesTypeError = class InvalidBytesTypeError extends BaseError3 {
    constructor(value) {
      super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid Bytes value.`, {
        metaMessages: ["Bytes values must be of type `Bytes`."]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Bytes.InvalidBytesTypeError"
      });
    }
  };
  SizeOverflowError2 = class SizeOverflowError2 extends BaseError3 {
    constructor({ givenSize, maxSize }) {
      super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Bytes.SizeOverflowError"
      });
    }
  };
  SliceOffsetOutOfBoundsError2 = class SliceOffsetOutOfBoundsError2 extends BaseError3 {
    constructor({ offset, position, size: size5 }) {
      super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size5}\`).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Bytes.SliceOffsetOutOfBoundsError"
      });
    }
  };
  SizeExceedsPaddingSizeError2 = class SizeExceedsPaddingSizeError2 extends BaseError3 {
    constructor({ size: size5, targetSize, type }) {
      super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Bytes.SizeExceedsPaddingSizeError"
      });
    }
  };
});

// node_modules/ox/_esm/core/Hex.js
function assert2(value, options = {}) {
  const { strict = false } = options;
  if (!value)
    throw new InvalidHexTypeError(value);
  if (typeof value !== "string")
    throw new InvalidHexTypeError(value);
  if (strict) {
    if (!/^0x[0-9a-fA-F]*$/.test(value))
      throw new InvalidHexValueError(value);
  }
  if (!value.startsWith("0x"))
    throw new InvalidHexValueError(value);
}
function concat2(...values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
function from2(value) {
  if (value instanceof Uint8Array)
    return fromBytes(value);
  if (Array.isArray(value))
    return fromBytes(new Uint8Array(value));
  return value;
}
function fromBoolean(value, options = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof options.size === "number") {
    assertSize3(hex, options.size);
    return padLeft(hex, options.size);
  }
  return hex;
}
function fromBytes(value, options = {}) {
  let string = "";
  for (let i = 0;i < value.length; i++)
    string += hexes3[value[i]];
  const hex = `0x${string}`;
  if (typeof options.size === "number") {
    assertSize3(hex, options.size);
    return padRight(hex, options.size);
  }
  return hex;
}
function fromNumber(value, options = {}) {
  const { signed, size: size5 } = options;
  const value_ = BigInt(value);
  let maxValue;
  if (size5) {
    if (signed)
      maxValue = (1n << BigInt(size5) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size5) * 8n) - 1n;
  } else if (typeof value === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value_ > maxValue || value_ < minValue) {
    const suffix = typeof value === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError2({
      max: maxValue ? `${maxValue}${suffix}` : undefined,
      min: `${minValue}${suffix}`,
      signed,
      size: size5,
      value: `${value}${suffix}`
    });
  }
  const stringValue = (signed && value_ < 0 ? BigInt.asUintN(size5 * 8, BigInt(value_)) : value_).toString(16);
  const hex = `0x${stringValue}`;
  if (size5)
    return padLeft(hex, size5);
  return hex;
}
function fromString2(value, options = {}) {
  return fromBytes(encoder4.encode(value), options);
}
function padLeft(value, size5) {
  return pad3(value, { dir: "left", size: size5 });
}
function padRight(value, size5) {
  return pad3(value, { dir: "right", size: size5 });
}
function slice3(value, start, end, options = {}) {
  const { strict } = options;
  assertStartOffset3(value, start);
  const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
  if (strict)
    assertEndOffset3(value_, start, end);
  return value_;
}
function size4(value) {
  return Math.ceil((value.length - 2) / 2);
}
function trimLeft2(value) {
  return trim3(value, { dir: "left" });
}
function toBigInt(hex, options = {}) {
  const { signed } = options;
  if (options.size)
    assertSize3(hex, options.size);
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size5 = (hex.length - 2) / 2;
  const max_unsigned = (1n << BigInt(size5) * 8n) - 1n;
  const max_signed = max_unsigned >> 1n;
  if (value <= max_signed)
    return value;
  return value - max_unsigned - 1n;
}
function toNumber(hex, options = {}) {
  const { signed, size: size5 } = options;
  if (!signed && !size5)
    return Number(hex);
  return Number(toBigInt(hex, options));
}
function validate2(value, options = {}) {
  const { strict = false } = options;
  try {
    assert2(value, { strict });
    return true;
  } catch {
    return false;
  }
}
var encoder4, hexes3, IntegerOutOfRangeError2, InvalidHexTypeError, InvalidHexValueError, SizeOverflowError3, SliceOffsetOutOfBoundsError3, SizeExceedsPaddingSizeError3;
var init_Hex = __esm(() => {
  init_Errors();
  init_hex();
  encoder4 = /* @__PURE__ */ new TextEncoder;
  hexes3 = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
  IntegerOutOfRangeError2 = class IntegerOutOfRangeError2 extends BaseError3 {
    constructor({ max, min, signed, size: size5, value }) {
      super(`Number \`${value}\` is not in safe${size5 ? ` ${size5 * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Hex.IntegerOutOfRangeError"
      });
    }
  };
  InvalidHexTypeError = class InvalidHexTypeError extends BaseError3 {
    constructor(value) {
      super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, {
        metaMessages: ['Hex types must be represented as `"0x${string}"`.']
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Hex.InvalidHexTypeError"
      });
    }
  };
  InvalidHexValueError = class InvalidHexValueError extends BaseError3 {
    constructor(value) {
      super(`Value \`${value}\` is an invalid hex value.`, {
        metaMessages: [
          'Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).'
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Hex.InvalidHexValueError"
      });
    }
  };
  SizeOverflowError3 = class SizeOverflowError3 extends BaseError3 {
    constructor({ givenSize, maxSize }) {
      super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Hex.SizeOverflowError"
      });
    }
  };
  SliceOffsetOutOfBoundsError3 = class SliceOffsetOutOfBoundsError3 extends BaseError3 {
    constructor({ offset, position, size: size5 }) {
      super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size5}\`).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Hex.SliceOffsetOutOfBoundsError"
      });
    }
  };
  SizeExceedsPaddingSizeError3 = class SizeExceedsPaddingSizeError3 extends BaseError3 {
    constructor({ size: size5, targetSize, type }) {
      super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Hex.SizeExceedsPaddingSizeError"
      });
    }
  };
});

// node_modules/ox/_esm/core/Withdrawal.js
function toRpc(withdrawal) {
  return {
    address: withdrawal.address,
    amount: fromNumber(withdrawal.amount),
    index: fromNumber(withdrawal.index),
    validatorIndex: fromNumber(withdrawal.validatorIndex)
  };
}
var init_Withdrawal = __esm(() => {
  init_Hex();
});

// node_modules/ox/_esm/core/BlockOverrides.js
function toRpc2(blockOverrides) {
  return {
    ...typeof blockOverrides.baseFeePerGas === "bigint" && {
      baseFeePerGas: fromNumber(blockOverrides.baseFeePerGas)
    },
    ...typeof blockOverrides.blobBaseFee === "bigint" && {
      blobBaseFee: fromNumber(blockOverrides.blobBaseFee)
    },
    ...typeof blockOverrides.feeRecipient === "string" && {
      feeRecipient: blockOverrides.feeRecipient
    },
    ...typeof blockOverrides.gasLimit === "bigint" && {
      gasLimit: fromNumber(blockOverrides.gasLimit)
    },
    ...typeof blockOverrides.number === "bigint" && {
      number: fromNumber(blockOverrides.number)
    },
    ...typeof blockOverrides.prevRandao === "bigint" && {
      prevRandao: fromNumber(blockOverrides.prevRandao)
    },
    ...typeof blockOverrides.time === "bigint" && {
      time: fromNumber(blockOverrides.time)
    },
    ...blockOverrides.withdrawals && {
      withdrawals: blockOverrides.withdrawals.map(toRpc)
    }
  };
}
var init_BlockOverrides = __esm(() => {
  init_Hex();
  init_Withdrawal();
});

// node_modules/viem/_esm/constants/contract.js
var aggregate3Signature = "0x82ad56cb";

// node_modules/viem/_esm/constants/contracts.js
var deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe", deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe", erc6492SignatureValidatorByteCode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572", multicall3Bytecode = "0x608060405234801561001057600080fd5b506115b9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e14610325578063bce38bd714610350578063c3077fa914610380578063ee82ac5e146103b2576100f3565b80634d2301cc1461026257806372425d9d1461029f57806382ad56cb146102ca57806386d516e8146102fa576100f3565b80633408e470116100c65780633408e470146101af578063399542e9146101da5780633e64a6961461020c57806342cbb15c14610237576100f3565b80630f28c97d146100f8578063174dea7114610123578063252dba421461015357806327e86d6e14610184575b600080fd5b34801561010457600080fd5b5061010d6103ef565b60405161011a9190610c0a565b60405180910390f35b61013d60048036038101906101389190610c94565b6103f7565b60405161014a9190610e94565b60405180910390f35b61016d60048036038101906101689190610f0c565b610615565b60405161017b92919061101b565b60405180910390f35b34801561019057600080fd5b506101996107ab565b6040516101a69190611064565b60405180910390f35b3480156101bb57600080fd5b506101c46107b7565b6040516101d19190610c0a565b60405180910390f35b6101f460048036038101906101ef91906110ab565b6107bf565b6040516102039392919061110b565b60405180910390f35b34801561021857600080fd5b506102216107e1565b60405161022e9190610c0a565b60405180910390f35b34801561024357600080fd5b5061024c6107e9565b6040516102599190610c0a565b60405180910390f35b34801561026e57600080fd5b50610289600480360381019061028491906111a7565b6107f1565b6040516102969190610c0a565b60405180910390f35b3480156102ab57600080fd5b506102b4610812565b6040516102c19190610c0a565b60405180910390f35b6102e460048036038101906102df919061122a565b61081a565b6040516102f19190610e94565b60405180910390f35b34801561030657600080fd5b5061030f6109e4565b60405161031c9190610c0a565b60405180910390f35b34801561033157600080fd5b5061033a6109ec565b6040516103479190611286565b60405180910390f35b61036a600480360381019061036591906110ab565b6109f4565b6040516103779190610e94565b60405180910390f35b61039a60048036038101906103959190610f0c565b610ba6565b6040516103a99392919061110b565b60405180910390f35b3480156103be57600080fd5b506103d960048036038101906103d491906112cd565b610bca565b6040516103e69190611064565b60405180910390f35b600042905090565b60606000808484905090508067ffffffffffffffff81111561041c5761041b6112fa565b5b60405190808252806020026020018201604052801561045557816020015b610442610bd5565b81526020019060019003908161043a5790505b5092503660005b828110156105c957600085828151811061047957610478611329565b5b6020026020010151905087878381811061049657610495611329565b5b90506020028101906104a89190611367565b925060008360400135905080860195508360000160208101906104cb91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16818580606001906104f2919061138f565b604051610500929190611431565b60006040518083038185875af1925050503d806000811461053d576040519150601f19603f3d011682016040523d82523d6000602084013e610542565b606091505b5083600001846020018290528215151515815250505081516020850135176105bc577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b826001019250505061045c565b5082341461060c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610603906114a7565b60405180910390fd5b50505092915050565b6000606043915060008484905090508067ffffffffffffffff81111561063e5761063d6112fa565b5b60405190808252806020026020018201604052801561067157816020015b606081526020019060019003908161065c5790505b5091503660005b828110156107a157600087878381811061069557610694611329565b5b90506020028101906106a791906114c7565b92508260000160208101906106bc91906111a7565b73ffffffffffffffffffffffffffffffffffffffff168380602001906106e2919061138f565b6040516106f0929190611431565b6000604051808303816000865af19150503d806000811461072d576040519150601f19603f3d011682016040523d82523d6000602084013e610732565b606091505b5086848151811061074657610745611329565b5b60200260200101819052819250505080610795576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078c9061153b565b60405180910390fd5b81600101915050610678565b5050509250929050565b60006001430340905090565b600046905090565b6000806060439250434091506107d68686866109f4565b905093509350939050565b600048905090565b600043905090565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b600044905090565b606060008383905090508067ffffffffffffffff81111561083e5761083d6112fa565b5b60405190808252806020026020018201604052801561087757816020015b610864610bd5565b81526020019060019003908161085c5790505b5091503660005b828110156109db57600084828151811061089b5761089a611329565b5b602002602001015190508686838181106108b8576108b7611329565b5b90506020028101906108ca919061155b565b92508260000160208101906108df91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060400190610905919061138f565b604051610913929190611431565b6000604051808303816000865af19150503d8060008114610950576040519150601f19603f3d011682016040523d82523d6000602084013e610955565b606091505b5082600001836020018290528215151515815250505080516020840135176109cf577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b8160010191505061087e565b50505092915050565b600045905090565b600041905090565b606060008383905090508067ffffffffffffffff811115610a1857610a176112fa565b5b604051908082528060200260200182016040528015610a5157816020015b610a3e610bd5565b815260200190600190039081610a365790505b5091503660005b82811015610b9c576000848281518110610a7557610a74611329565b5b60200260200101519050868683818110610a9257610a91611329565b5b9050602002810190610aa491906114c7565b9250826000016020810190610ab991906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060200190610adf919061138f565b604051610aed929190611431565b6000604051808303816000865af19150503d8060008114610b2a576040519150601f19603f3d011682016040523d82523d6000602084013e610b2f565b606091505b508260000183602001829052821515151581525050508715610b90578060000151610b8f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b869061153b565b60405180910390fd5b5b81600101915050610a58565b5050509392505050565b6000806060610bb7600186866107bf565b8093508194508295505050509250925092565b600081409050919050565b6040518060400160405280600015158152602001606081525090565b6000819050919050565b610c0481610bf1565b82525050565b6000602082019050610c1f6000830184610bfb565b92915050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f840112610c5457610c53610c2f565b5b8235905067ffffffffffffffff811115610c7157610c70610c34565b5b602083019150836020820283011115610c8d57610c8c610c39565b5b9250929050565b60008060208385031215610cab57610caa610c25565b5b600083013567ffffffffffffffff811115610cc957610cc8610c2a565b5b610cd585828601610c3e565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60008115159050919050565b610d2281610d0d565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610d62578082015181840152602081019050610d47565b83811115610d71576000848401525b50505050565b6000601f19601f8301169050919050565b6000610d9382610d28565b610d9d8185610d33565b9350610dad818560208601610d44565b610db681610d77565b840191505092915050565b6000604083016000830151610dd96000860182610d19565b5060208301518482036020860152610df18282610d88565b9150508091505092915050565b6000610e0a8383610dc1565b905092915050565b6000602082019050919050565b6000610e2a82610ce1565b610e348185610cec565b935083602082028501610e4685610cfd565b8060005b85811015610e825784840389528151610e638582610dfe565b9450610e6e83610e12565b925060208a01995050600181019050610e4a565b50829750879550505050505092915050565b60006020820190508181036000830152610eae8184610e1f565b905092915050565b60008083601f840112610ecc57610ecb610c2f565b5b8235905067ffffffffffffffff811115610ee957610ee8610c34565b5b602083019150836020820283011115610f0557610f04610c39565b5b9250929050565b60008060208385031215610f2357610f22610c25565b5b600083013567ffffffffffffffff811115610f4157610f40610c2a565b5b610f4d85828601610eb6565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000610f918383610d88565b905092915050565b6000602082019050919050565b6000610fb182610f59565b610fbb8185610f64565b935083602082028501610fcd85610f75565b8060005b858110156110095784840389528151610fea8582610f85565b9450610ff583610f99565b925060208a01995050600181019050610fd1565b50829750879550505050505092915050565b60006040820190506110306000830185610bfb565b81810360208301526110428184610fa6565b90509392505050565b6000819050919050565b61105e8161104b565b82525050565b60006020820190506110796000830184611055565b92915050565b61108881610d0d565b811461109357600080fd5b50565b6000813590506110a58161107f565b92915050565b6000806000604084860312156110c4576110c3610c25565b5b60006110d286828701611096565b935050602084013567ffffffffffffffff8111156110f3576110f2610c2a565b5b6110ff86828701610eb6565b92509250509250925092565b60006060820190506111206000830186610bfb565b61112d6020830185611055565b818103604083015261113f8184610e1f565b9050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061117482611149565b9050919050565b61118481611169565b811461118f57600080fd5b50565b6000813590506111a18161117b565b92915050565b6000602082840312156111bd576111bc610c25565b5b60006111cb84828501611192565b91505092915050565b60008083601f8401126111ea576111e9610c2f565b5b8235905067ffffffffffffffff81111561120757611206610c34565b5b60208301915083602082028301111561122357611222610c39565b5b9250929050565b6000806020838503121561124157611240610c25565b5b600083013567ffffffffffffffff81111561125f5761125e610c2a565b5b61126b858286016111d4565b92509250509250929050565b61128081611169565b82525050565b600060208201905061129b6000830184611277565b92915050565b6112aa81610bf1565b81146112b557600080fd5b50565b6000813590506112c7816112a1565b92915050565b6000602082840312156112e3576112e2610c25565b5b60006112f1848285016112b8565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b60008235600160800383360303811261138357611382611358565b5b80830191505092915050565b600080833560016020038436030381126113ac576113ab611358565b5b80840192508235915067ffffffffffffffff8211156113ce576113cd61135d565b5b6020830192506001820236038313156113ea576113e9611362565b5b509250929050565b600081905092915050565b82818337600083830152505050565b600061141883856113f2565b93506114258385846113fd565b82840190509392505050565b600061143e82848661140c565b91508190509392505050565b600082825260208201905092915050565b7f4d756c746963616c6c333a2076616c7565206d69736d61746368000000000000600082015250565b6000611491601a8361144a565b915061149c8261145b565b602082019050919050565b600060208201905081810360008301526114c081611484565b9050919050565b6000823560016040038336030381126114e3576114e2611358565b5b80830191505092915050565b7f4d756c746963616c6c333a2063616c6c206661696c6564000000000000000000600082015250565b600061152560178361144a565b9150611530826114ef565b602082019050919050565b6000602082019050818103600083015261155481611518565b9050919050565b60008235600160600383360303811261157757611576611358565b5b8083019150509291505056fea264697066735822122020c1bc9aacf8e4a6507193432a895a8e77094f45a1395583f07b24e860ef06cd64736f6c634300080c0033";

// node_modules/viem/_esm/utils/abi/encodeDeployData.js
function encodeDeployData(parameters) {
  const { abi, args, bytecode } = parameters;
  if (!args || args.length === 0)
    return bytecode;
  const description = abi.find((x) => ("type" in x) && x.type === "constructor");
  if (!description)
    throw new AbiConstructorNotFoundError({ docsPath: docsPath5 });
  if (!("inputs" in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
  const data = encodeAbiParameters(description.inputs, args);
  return concatHex([bytecode, data]);
}
var docsPath5 = "/docs/contract/encodeDeployData";
var init_encodeDeployData = __esm(() => {
  init_abi();
  init_encodeAbiParameters();
});

// node_modules/viem/_esm/utils/address/isAddressEqual.js
function isAddressEqual(a, b) {
  if (!isAddress(a, { strict: false }))
    throw new InvalidAddressError({ address: a });
  if (!isAddress(b, { strict: false }))
    throw new InvalidAddressError({ address: b });
  return a.toLowerCase() === b.toLowerCase();
}
var init_isAddressEqual = __esm(() => {
  init_address();
  init_isAddress();
});

// node_modules/viem/_esm/utils/block/formatBlockParameter.js
function formatBlockParameter(parameters) {
  const { blockHash, blockNumber, blockTag, requireCanonical } = parameters;
  if (requireCanonical !== undefined && !blockHash)
    throw new BaseError("`requireCanonical` can only be provided when `blockHash` is set.");
  if (blockHash)
    return requireCanonical ? { blockHash, requireCanonical } : { blockHash };
  if (typeof blockNumber === "bigint")
    return numberToHex(blockNumber);
  return blockTag ?? "latest";
}
var init_formatBlockParameter = __esm(() => {
  init_base();
  init_toHex();
});

// node_modules/viem/_esm/errors/node.js
var ExecutionRevertedError, FeeCapTooHighError, FeeCapTooLowError, NonceTooHighError, NonceTooLowError, NonceMaxValueError, InsufficientFundsError, IntrinsicGasTooHighError, IntrinsicGasTooLowError, TransactionTypeNotSupportedError, TipAboveFeeCapError, UnknownNodeError;
var init_node = __esm(() => {
  init_formatGwei();
  init_base();
  ExecutionRevertedError = class ExecutionRevertedError extends BaseError {
    constructor({ cause, message } = {}) {
      const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
      super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
        cause,
        name: "ExecutionRevertedError"
      });
    }
  };
  Object.defineProperty(ExecutionRevertedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 3
  });
  Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /execution reverted|gas required exceeds allowance/
  });
  FeeCapTooHighError = class FeeCapTooHighError extends BaseError {
    constructor({ cause, maxFeePerGas } = {}) {
      super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei2(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
        cause,
        name: "FeeCapTooHighError"
      });
    }
  };
  Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
  });
  FeeCapTooLowError = class FeeCapTooLowError extends BaseError {
    constructor({ cause, maxFeePerGas } = {}) {
      super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei2(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
        cause,
        name: "FeeCapTooLowError"
      });
    }
  };
  Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
  });
  NonceTooHighError = class NonceTooHighError extends BaseError {
    constructor({ cause, nonce } = {}) {
      super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause, name: "NonceTooHighError" });
    }
  };
  Object.defineProperty(NonceTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /nonce too high/
  });
  NonceTooLowError = class NonceTooLowError extends BaseError {
    constructor({ cause, nonce } = {}) {
      super([
        `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
        "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
      ].join(`
`), { cause, name: "NonceTooLowError" });
    }
  };
  Object.defineProperty(NonceTooLowError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /nonce too low|transaction already imported|already known/
  });
  NonceMaxValueError = class NonceMaxValueError extends BaseError {
    constructor({ cause, nonce } = {}) {
      super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause, name: "NonceMaxValueError" });
    }
  };
  Object.defineProperty(NonceMaxValueError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /nonce has max value/
  });
  InsufficientFundsError = class InsufficientFundsError extends BaseError {
    constructor({ cause } = {}) {
      super([
        "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
      ].join(`
`), {
        cause,
        metaMessages: [
          "This error could arise when the account does not have enough funds to:",
          " - pay for the total gas fee,",
          " - pay for the value to send.",
          " ",
          "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
          " - `gas` is the amount of gas needed for transaction to execute,",
          " - `gas fee` is the gas fee,",
          " - `value` is the amount of ether to send to the recipient."
        ],
        name: "InsufficientFundsError"
      });
    }
  };
  Object.defineProperty(InsufficientFundsError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /insufficient funds|exceeds transaction sender account balance/
  });
  IntrinsicGasTooHighError = class IntrinsicGasTooHighError extends BaseError {
    constructor({ cause, gas } = {}) {
      super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
        cause,
        name: "IntrinsicGasTooHighError"
      });
    }
  };
  Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /intrinsic gas too high|gas limit reached/
  });
  IntrinsicGasTooLowError = class IntrinsicGasTooLowError extends BaseError {
    constructor({ cause, gas } = {}) {
      super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
        cause,
        name: "IntrinsicGasTooLowError"
      });
    }
  };
  Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /intrinsic gas too low/
  });
  TransactionTypeNotSupportedError = class TransactionTypeNotSupportedError extends BaseError {
    constructor({ cause }) {
      super("The transaction type is not supported for this chain.", {
        cause,
        name: "TransactionTypeNotSupportedError"
      });
    }
  };
  Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /transaction type not valid/
  });
  TipAboveFeeCapError = class TipAboveFeeCapError extends BaseError {
    constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
      super([
        `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei2(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei2(maxFeePerGas)} gwei` : ""}).`
      ].join(`
`), {
        cause,
        name: "TipAboveFeeCapError"
      });
    }
  };
  Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
  });
  UnknownNodeError = class UnknownNodeError extends BaseError {
    constructor({ cause }) {
      super(`An error occurred while executing: ${cause?.shortMessage}`, {
        cause,
        name: "UnknownNodeError"
      });
    }
  };
});

// node_modules/viem/_esm/utils/errors/getNodeError.js
function getNodeError(err, args) {
  const message = (err.details || "").toLowerCase();
  const executionRevertedError = err instanceof BaseError ? err.walk((e) => e?.code === ExecutionRevertedError.code) : err;
  if (executionRevertedError instanceof BaseError)
    return new ExecutionRevertedError({
      cause: err,
      message: executionRevertedError.details
    });
  if (ExecutionRevertedError.nodeMessage.test(message))
    return new ExecutionRevertedError({
      cause: err,
      message: err.details
    });
  if (FeeCapTooHighError.nodeMessage.test(message))
    return new FeeCapTooHighError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (FeeCapTooLowError.nodeMessage.test(message))
    return new FeeCapTooLowError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (NonceTooHighError.nodeMessage.test(message))
    return new NonceTooHighError({ cause: err, nonce: args?.nonce });
  if (NonceTooLowError.nodeMessage.test(message))
    return new NonceTooLowError({ cause: err, nonce: args?.nonce });
  if (NonceMaxValueError.nodeMessage.test(message))
    return new NonceMaxValueError({ cause: err, nonce: args?.nonce });
  if (InsufficientFundsError.nodeMessage.test(message))
    return new InsufficientFundsError({ cause: err });
  if (IntrinsicGasTooHighError.nodeMessage.test(message))
    return new IntrinsicGasTooHighError({ cause: err, gas: args?.gas });
  if (IntrinsicGasTooLowError.nodeMessage.test(message))
    return new IntrinsicGasTooLowError({ cause: err, gas: args?.gas });
  if (TransactionTypeNotSupportedError.nodeMessage.test(message))
    return new TransactionTypeNotSupportedError({ cause: err });
  if (TipAboveFeeCapError.nodeMessage.test(message))
    return new TipAboveFeeCapError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas,
      maxPriorityFeePerGas: args?.maxPriorityFeePerGas
    });
  return new UnknownNodeError({
    cause: err
  });
}
var init_getNodeError = __esm(() => {
  init_base();
  init_node();
});

// node_modules/viem/_esm/utils/errors/getCallError.js
function getCallError(err, { docsPath: docsPath6, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new CallExecutionError(cause, {
    docsPath: docsPath6,
    ...args
  });
}
var init_getCallError = __esm(() => {
  init_contract();
  init_node();
  init_getNodeError();
});

// node_modules/viem/_esm/utils/formatters/extract.js
function extract(value_, { format: format2 }) {
  if (!format2)
    return {};
  const value = {};
  function extract_(formatted2) {
    const keys = Object.keys(formatted2);
    for (const key of keys) {
      if (key in value_)
        value[key] = value_[key];
      if (formatted2[key] && typeof formatted2[key] === "object" && !Array.isArray(formatted2[key]))
        extract_(formatted2[key]);
    }
  }
  const formatted = format2(value_ || {});
  extract_(formatted);
  return value;
}

// node_modules/viem/_esm/utils/formatters/transactionRequest.js
function formatTransactionRequest(request, _) {
  const rpcRequest = {};
  if (typeof request.authorizationList !== "undefined")
    rpcRequest.authorizationList = formatAuthorizationList(request.authorizationList);
  if (typeof request.accessList !== "undefined")
    rpcRequest.accessList = request.accessList;
  if (typeof request.blobVersionedHashes !== "undefined")
    rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
  if (typeof request.blobs !== "undefined") {
    if (typeof request.blobs[0] !== "string")
      rpcRequest.blobs = request.blobs.map((x) => bytesToHex(x));
    else
      rpcRequest.blobs = request.blobs;
  }
  if (typeof request.data !== "undefined")
    rpcRequest.data = request.data;
  if (request.account)
    rpcRequest.from = request.account.address;
  if (typeof request.from !== "undefined")
    rpcRequest.from = request.from;
  if (typeof request.gas !== "undefined")
    rpcRequest.gas = numberToHex(request.gas);
  if (typeof request.gasPrice !== "undefined")
    rpcRequest.gasPrice = numberToHex(request.gasPrice);
  if (typeof request.maxFeePerBlobGas !== "undefined")
    rpcRequest.maxFeePerBlobGas = numberToHex(request.maxFeePerBlobGas);
  if (typeof request.maxFeePerGas !== "undefined")
    rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
  if (typeof request.maxPriorityFeePerGas !== "undefined")
    rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
  if (typeof request.nonce !== "undefined")
    rpcRequest.nonce = numberToHex(request.nonce);
  if (typeof request.to !== "undefined")
    rpcRequest.to = request.to;
  if (typeof request.type !== "undefined")
    rpcRequest.type = rpcTransactionType[request.type];
  if (typeof request.value !== "undefined")
    rpcRequest.value = numberToHex(request.value);
  return rpcRequest;
}
function formatAuthorizationList(authorizationList) {
  return authorizationList.map((authorization) => ({
    address: authorization.address,
    r: authorization.r ? numberToHex(BigInt(authorization.r)) : authorization.r,
    s: authorization.s ? numberToHex(BigInt(authorization.s)) : authorization.s,
    chainId: numberToHex(authorization.chainId),
    nonce: numberToHex(authorization.nonce),
    ...typeof authorization.yParity !== "undefined" ? { yParity: numberToHex(authorization.yParity) } : {},
    ...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: numberToHex(authorization.v) } : {}
  }));
}
var rpcTransactionType;
var init_transactionRequest = __esm(() => {
  init_toHex();
  rpcTransactionType = {
    legacy: "0x0",
    eip2930: "0x1",
    eip1559: "0x2",
    eip4844: "0x3",
    eip7702: "0x4"
  };
});

// node_modules/viem/_esm/utils/promise/withResolvers.js
function withResolvers() {
  let resolve = () => {
    return;
  };
  let reject = () => {
    return;
  };
  const promise = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });
  return { promise, resolve, reject };
}

// node_modules/viem/_esm/utils/promise/createBatchScheduler.js
function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0, sort }) {
  const exec = async () => {
    const scheduler = getScheduler();
    flush();
    const args = scheduler.map(({ args: args2 }) => args2);
    if (args.length === 0)
      return;
    fn(args).then((data) => {
      if (sort && Array.isArray(data))
        data.sort(sort);
      for (let i = 0;i < scheduler.length; i++) {
        const { resolve } = scheduler[i];
        resolve?.([data[i], data]);
      }
    }).catch((err) => {
      for (let i = 0;i < scheduler.length; i++) {
        const { reject } = scheduler[i];
        reject?.(err);
      }
    });
  };
  const flush = () => schedulerCache.delete(id);
  const getBatchedArgs = () => getScheduler().map(({ args }) => args);
  const getScheduler = () => schedulerCache.get(id) || [];
  const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
  return {
    flush,
    async schedule(args) {
      const { promise, resolve, reject } = withResolvers();
      const split2 = shouldSplitBatch?.([...getBatchedArgs(), args]);
      if (split2)
        exec();
      const hasActiveScheduler = getScheduler().length > 0;
      if (hasActiveScheduler) {
        setScheduler({ args, resolve, reject });
        return promise;
      }
      setScheduler({ args, resolve, reject });
      setTimeout(exec, wait);
      return promise;
    }
  };
}
var schedulerCache;
var init_createBatchScheduler = __esm(() => {
  schedulerCache = /* @__PURE__ */ new Map;
});

// node_modules/viem/_esm/utils/stateOverride.js
function serializeStateMapping(stateMapping) {
  if (!stateMapping || stateMapping.length === 0)
    return;
  return stateMapping.reduce((acc, { slot, value }) => {
    if (slot.length !== 66)
      throw new InvalidBytesLengthError({
        size: slot.length,
        targetSize: 66,
        type: "hex"
      });
    if (value.length !== 66)
      throw new InvalidBytesLengthError({
        size: value.length,
        targetSize: 66,
        type: "hex"
      });
    acc[slot] = value;
    return acc;
  }, {});
}
function serializeAccountStateOverride(parameters) {
  const { balance, nonce, state, stateDiff, code } = parameters;
  const rpcAccountStateOverride = {};
  if (code !== undefined)
    rpcAccountStateOverride.code = code;
  if (balance !== undefined)
    rpcAccountStateOverride.balance = numberToHex(balance);
  if (nonce !== undefined)
    rpcAccountStateOverride.nonce = numberToHex(nonce);
  if (state !== undefined)
    rpcAccountStateOverride.state = serializeStateMapping(state);
  if (stateDiff !== undefined) {
    if (rpcAccountStateOverride.state)
      throw new StateAssignmentConflictError;
    rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
  }
  return rpcAccountStateOverride;
}
function serializeStateOverride(parameters) {
  if (!parameters)
    return;
  const rpcStateOverride = {};
  for (const { address, ...accountState } of parameters) {
    if (!isAddress(address, { strict: false }))
      throw new InvalidAddressError({ address });
    if (rpcStateOverride[address])
      throw new AccountStateConflictError({ address });
    rpcStateOverride[address] = serializeAccountStateOverride(accountState);
  }
  return rpcStateOverride;
}
var init_stateOverride2 = __esm(() => {
  init_address();
  init_data();
  init_stateOverride();
  init_isAddress();
  init_toHex();
});

// node_modules/viem/_esm/constants/number.js
var maxInt8, maxInt16, maxInt24, maxInt32, maxInt40, maxInt48, maxInt56, maxInt64, maxInt72, maxInt80, maxInt88, maxInt96, maxInt104, maxInt112, maxInt120, maxInt128, maxInt136, maxInt144, maxInt152, maxInt160, maxInt168, maxInt176, maxInt184, maxInt192, maxInt200, maxInt208, maxInt216, maxInt224, maxInt232, maxInt240, maxInt248, maxInt256, minInt8, minInt16, minInt24, minInt32, minInt40, minInt48, minInt56, minInt64, minInt72, minInt80, minInt88, minInt96, minInt104, minInt112, minInt120, minInt128, minInt136, minInt144, minInt152, minInt160, minInt168, minInt176, minInt184, minInt192, minInt200, minInt208, minInt216, minInt224, minInt232, minInt240, minInt248, minInt256, maxUint8, maxUint16, maxUint24, maxUint32, maxUint40, maxUint48, maxUint56, maxUint64, maxUint72, maxUint80, maxUint88, maxUint96, maxUint104, maxUint112, maxUint120, maxUint128, maxUint136, maxUint144, maxUint152, maxUint160, maxUint168, maxUint176, maxUint184, maxUint192, maxUint200, maxUint208, maxUint216, maxUint224, maxUint232, maxUint240, maxUint248, maxUint256;
var init_number = __esm(() => {
  maxInt8 = 2n ** (8n - 1n) - 1n;
  maxInt16 = 2n ** (16n - 1n) - 1n;
  maxInt24 = 2n ** (24n - 1n) - 1n;
  maxInt32 = 2n ** (32n - 1n) - 1n;
  maxInt40 = 2n ** (40n - 1n) - 1n;
  maxInt48 = 2n ** (48n - 1n) - 1n;
  maxInt56 = 2n ** (56n - 1n) - 1n;
  maxInt64 = 2n ** (64n - 1n) - 1n;
  maxInt72 = 2n ** (72n - 1n) - 1n;
  maxInt80 = 2n ** (80n - 1n) - 1n;
  maxInt88 = 2n ** (88n - 1n) - 1n;
  maxInt96 = 2n ** (96n - 1n) - 1n;
  maxInt104 = 2n ** (104n - 1n) - 1n;
  maxInt112 = 2n ** (112n - 1n) - 1n;
  maxInt120 = 2n ** (120n - 1n) - 1n;
  maxInt128 = 2n ** (128n - 1n) - 1n;
  maxInt136 = 2n ** (136n - 1n) - 1n;
  maxInt144 = 2n ** (144n - 1n) - 1n;
  maxInt152 = 2n ** (152n - 1n) - 1n;
  maxInt160 = 2n ** (160n - 1n) - 1n;
  maxInt168 = 2n ** (168n - 1n) - 1n;
  maxInt176 = 2n ** (176n - 1n) - 1n;
  maxInt184 = 2n ** (184n - 1n) - 1n;
  maxInt192 = 2n ** (192n - 1n) - 1n;
  maxInt200 = 2n ** (200n - 1n) - 1n;
  maxInt208 = 2n ** (208n - 1n) - 1n;
  maxInt216 = 2n ** (216n - 1n) - 1n;
  maxInt224 = 2n ** (224n - 1n) - 1n;
  maxInt232 = 2n ** (232n - 1n) - 1n;
  maxInt240 = 2n ** (240n - 1n) - 1n;
  maxInt248 = 2n ** (248n - 1n) - 1n;
  maxInt256 = 2n ** (256n - 1n) - 1n;
  minInt8 = -(2n ** (8n - 1n));
  minInt16 = -(2n ** (16n - 1n));
  minInt24 = -(2n ** (24n - 1n));
  minInt32 = -(2n ** (32n - 1n));
  minInt40 = -(2n ** (40n - 1n));
  minInt48 = -(2n ** (48n - 1n));
  minInt56 = -(2n ** (56n - 1n));
  minInt64 = -(2n ** (64n - 1n));
  minInt72 = -(2n ** (72n - 1n));
  minInt80 = -(2n ** (80n - 1n));
  minInt88 = -(2n ** (88n - 1n));
  minInt96 = -(2n ** (96n - 1n));
  minInt104 = -(2n ** (104n - 1n));
  minInt112 = -(2n ** (112n - 1n));
  minInt120 = -(2n ** (120n - 1n));
  minInt128 = -(2n ** (128n - 1n));
  minInt136 = -(2n ** (136n - 1n));
  minInt144 = -(2n ** (144n - 1n));
  minInt152 = -(2n ** (152n - 1n));
  minInt160 = -(2n ** (160n - 1n));
  minInt168 = -(2n ** (168n - 1n));
  minInt176 = -(2n ** (176n - 1n));
  minInt184 = -(2n ** (184n - 1n));
  minInt192 = -(2n ** (192n - 1n));
  minInt200 = -(2n ** (200n - 1n));
  minInt208 = -(2n ** (208n - 1n));
  minInt216 = -(2n ** (216n - 1n));
  minInt224 = -(2n ** (224n - 1n));
  minInt232 = -(2n ** (232n - 1n));
  minInt240 = -(2n ** (240n - 1n));
  minInt248 = -(2n ** (248n - 1n));
  minInt256 = -(2n ** (256n - 1n));
  maxUint8 = 2n ** 8n - 1n;
  maxUint16 = 2n ** 16n - 1n;
  maxUint24 = 2n ** 24n - 1n;
  maxUint32 = 2n ** 32n - 1n;
  maxUint40 = 2n ** 40n - 1n;
  maxUint48 = 2n ** 48n - 1n;
  maxUint56 = 2n ** 56n - 1n;
  maxUint64 = 2n ** 64n - 1n;
  maxUint72 = 2n ** 72n - 1n;
  maxUint80 = 2n ** 80n - 1n;
  maxUint88 = 2n ** 88n - 1n;
  maxUint96 = 2n ** 96n - 1n;
  maxUint104 = 2n ** 104n - 1n;
  maxUint112 = 2n ** 112n - 1n;
  maxUint120 = 2n ** 120n - 1n;
  maxUint128 = 2n ** 128n - 1n;
  maxUint136 = 2n ** 136n - 1n;
  maxUint144 = 2n ** 144n - 1n;
  maxUint152 = 2n ** 152n - 1n;
  maxUint160 = 2n ** 160n - 1n;
  maxUint168 = 2n ** 168n - 1n;
  maxUint176 = 2n ** 176n - 1n;
  maxUint184 = 2n ** 184n - 1n;
  maxUint192 = 2n ** 192n - 1n;
  maxUint200 = 2n ** 200n - 1n;
  maxUint208 = 2n ** 208n - 1n;
  maxUint216 = 2n ** 216n - 1n;
  maxUint224 = 2n ** 224n - 1n;
  maxUint232 = 2n ** 232n - 1n;
  maxUint240 = 2n ** 240n - 1n;
  maxUint248 = 2n ** 248n - 1n;
  maxUint256 = 2n ** 256n - 1n;
});

// node_modules/viem/_esm/utils/transaction/assertRequest.js
function assertRequest(args) {
  const { account: account_, maxFeePerGas, maxPriorityFeePerGas, to } = args;
  const account = account_ ? parseAccount(account_) : undefined;
  if (account && !isAddress(account.address))
    throw new InvalidAddressError({ address: account.address });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxFeePerGas && maxFeePerGas > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
var init_assertRequest = __esm(() => {
  init_number();
  init_address();
  init_node();
  init_isAddress();
});

// node_modules/viem/_esm/errors/ccip.js
var OffchainLookupError, OffchainLookupResponseMalformedError, OffchainLookupSenderMismatchError;
var init_ccip = __esm(() => {
  init_base();
  OffchainLookupError = class OffchainLookupError extends BaseError {
    constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
      super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
        cause,
        metaMessages: [
          ...cause.metaMessages || [],
          cause.metaMessages?.length ? "" : [],
          "Offchain Gateway Call:",
          urls && [
            "  Gateway URL(s):",
            ...urls.map((url) => `    ${getUrl(url)}`)
          ],
          `  Sender: ${sender}`,
          `  Data: ${data}`,
          `  Callback selector: ${callbackSelector}`,
          `  Extra data: ${extraData}`
        ].flat(),
        name: "OffchainLookupError"
      });
    }
  };
  OffchainLookupResponseMalformedError = class OffchainLookupResponseMalformedError extends BaseError {
    constructor({ result, url }) {
      super("Offchain gateway response is malformed. Response data must be a hex value.", {
        metaMessages: [
          `Gateway URL: ${getUrl(url)}`,
          `Response: ${stringify(result)}`
        ],
        name: "OffchainLookupResponseMalformedError"
      });
    }
  };
  OffchainLookupSenderMismatchError = class OffchainLookupSenderMismatchError extends BaseError {
    constructor({ sender, to }) {
      super("Reverted sender address does not match target contract address (`to`).", {
        metaMessages: [
          `Contract address: ${to}`,
          `OffchainLookup sender address: ${sender}`
        ],
        name: "OffchainLookupSenderMismatchError"
      });
    }
  };
});

// node_modules/viem/_esm/utils/ccip.js
var exports_ccip = {};
__export(exports_ccip, {
  offchainLookupSignature: () => offchainLookupSignature,
  offchainLookupAbiItem: () => offchainLookupAbiItem,
  offchainLookup: () => offchainLookup,
  ccipRequest: () => ccipRequest
});
async function offchainLookup(client, { blockNumber, blockTag, data, requestOptions, to }) {
  const { args } = decodeErrorResult({
    data,
    abi: [offchainLookupAbiItem]
  });
  const [sender, urls, callData, callbackSelector, extraData] = args;
  const { ccipRead } = client;
  const ccipRequest_ = ccipRead && typeof ccipRead?.request === "function" ? ccipRead.request : ccipRequest;
  try {
    if (!isAddressEqual(to, sender))
      throw new OffchainLookupSenderMismatchError({ sender, to });
    const result = urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({
      data: callData,
      ccipRequest: (parameters) => ccipRequest_({ ...parameters, requestOptions })
    }) : await ccipRequest_({ data: callData, requestOptions, sender, urls });
    const { data: data_ } = await call(client, {
      blockNumber,
      blockTag,
      data: concat([
        callbackSelector,
        encodeAbiParameters([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
      ]),
      requestOptions,
      to
    });
    return data_;
  } catch (err) {
    if (requestOptions?.signal?.aborted)
      throw getAbortError(requestOptions.signal);
    if (isAbortError(err))
      throw err;
    throw new OffchainLookupError({
      callbackSelector,
      cause: err,
      data,
      extraData,
      sender,
      urls
    });
  }
}
async function ccipRequest({ data, requestOptions, sender, urls }) {
  let error = new Error("An unknown error occurred.");
  for (let i = 0;i < urls.length; i++) {
    if (requestOptions?.signal?.aborted)
      throw getAbortError(requestOptions.signal);
    const url = urls[i];
    const method = url.includes("{data}") ? "GET" : "POST";
    const body = method === "POST" ? { data, sender } : undefined;
    const headers = method === "POST" ? { "Content-Type": "application/json" } : {};
    try {
      const response = await fetch(url.replace("{sender}", sender.toLowerCase()).replace("{data}", data), {
        body: JSON.stringify(body),
        headers,
        method,
        ...requestOptions?.signal ? { signal: requestOptions.signal } : {}
      });
      let result;
      if (response.headers.get("Content-Type")?.startsWith("application/json")) {
        result = (await response.json()).data;
      } else {
        result = await response.text();
      }
      if (!response.ok) {
        error = new HttpRequestError({
          body,
          details: result?.error ? stringify(result.error) : response.statusText,
          headers: response.headers,
          status: response.status,
          url
        });
        continue;
      }
      if (!isHex(result)) {
        error = new OffchainLookupResponseMalformedError({
          result,
          url
        });
        continue;
      }
      return result;
    } catch (err) {
      if (requestOptions?.signal?.aborted)
        throw getAbortError(requestOptions.signal);
      if (isAbortError(err))
        throw err;
      error = new HttpRequestError({
        body,
        details: err.message,
        url
      });
    }
  }
  throw error;
}
var offchainLookupSignature = "0x556f1830", offchainLookupAbiItem;
var init_ccip2 = __esm(() => {
  init_call();
  init_ccip();
  init_request();
  init_decodeErrorResult();
  init_encodeAbiParameters();
  init_isAddressEqual();
  init_localBatchGatewayRequest();
  offchainLookupAbiItem = {
    name: "OffchainLookup",
    type: "error",
    inputs: [
      {
        name: "sender",
        type: "address"
      },
      {
        name: "urls",
        type: "string[]"
      },
      {
        name: "callData",
        type: "bytes"
      },
      {
        name: "callbackFunction",
        type: "bytes4"
      },
      {
        name: "extraData",
        type: "bytes"
      }
    ]
  };
});

// node_modules/viem/_esm/actions/public/call.js
async function call(client, args) {
  const { account: account_ = client.account, authorizationList, batch = Boolean(client.batch?.multicall), blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", requireCanonical, accessList, blobs, blockOverrides, code, data: data_, factory, factoryData, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, requestOptions, to, value, stateOverride, ...rest } = args;
  const account = account_ ? parseAccount(account_) : undefined;
  if (code && (factory || factoryData))
    throw new BaseError("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
  if (code && to)
    throw new BaseError("Cannot provide both `code` & `to` as parameters.");
  const deploylessCallViaBytecode = code && data_;
  const deploylessCallViaFactory = factory && factoryData && to && data_;
  const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
  const data = (() => {
    if (deploylessCallViaBytecode)
      return toDeploylessCallViaBytecodeData({
        code,
        data: data_
      });
    if (deploylessCallViaFactory)
      return toDeploylessCallViaFactoryData({
        data: data_,
        factory,
        factoryData,
        to
      });
    return data_;
  })();
  try {
    assertRequest(args);
    const block = formatBlockParameter({
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    const rpcBlockOverrides = blockOverrides ? toRpc2(blockOverrides) : undefined;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format2 = chainFormat || formatTransactionRequest;
    const request = format2({
      ...extract(rest, { format: chainFormat }),
      accessList,
      account,
      authorizationList,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to: deploylessCall ? undefined : to,
      value
    }, "call");
    if (batch && shouldPerformMulticall({ request }) && !rpcBlockOverrides && blockHash === undefined) {
      try {
        const { deployless = false } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
        const multicallAddress = getMulticallAddress(client, {
          blockNumber,
          deployless
        });
        if (!multicallAddress || !hasStateOverrideForAddress(rpcStateOverride, multicallAddress))
          return await scheduleMulticall(client, {
            ...request,
            blockHash,
            blockNumber,
            blockTag,
            multicallAddress,
            requestOptions,
            requireCanonical,
            rpcStateOverride
          });
      } catch (err) {
        if (!(err instanceof ClientChainNotConfiguredError) && !(err instanceof ChainDoesNotSupportContract))
          throw err;
      }
    }
    const params = (() => {
      const base = [
        request,
        block
      ];
      if (rpcStateOverride && rpcBlockOverrides)
        return [...base, rpcStateOverride, rpcBlockOverrides];
      if (rpcStateOverride)
        return [...base, rpcStateOverride];
      if (rpcBlockOverrides)
        return [...base, {}, rpcBlockOverrides];
      return base;
    })();
    const response = await client.request({
      method: "eth_call",
      params
    }, requestOptions);
    if (response === "0x")
      return { data: undefined };
    return { data: response };
  } catch (err) {
    if (requestOptions?.signal?.aborted)
      throw getAbortError(requestOptions.signal);
    if (isAbortError(err))
      throw err;
    const data2 = getRevertErrorData(err);
    const { offchainLookup: offchainLookup2, offchainLookupSignature: offchainLookupSignature2 } = await Promise.resolve().then(() => (init_ccip2(), exports_ccip));
    if (client.ccipRead !== false && data2?.slice(0, 10) === offchainLookupSignature2 && to)
      return {
        data: await offchainLookup2(client, { data: data2, requestOptions, to })
      };
    if (deploylessCall && data2?.slice(0, 10) === "0x101bb98d")
      throw new CounterfactualDeploymentFailedError({ factory });
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}
function shouldPerformMulticall({ request }) {
  const { data, to, ...request_ } = request;
  if (!data)
    return false;
  if (data.startsWith(aggregate3Signature))
    return false;
  if (!to)
    return false;
  if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
    return false;
  return true;
}
function getRequestOptionsId(requestOptions) {
  if (!requestOptions)
    return "default";
  const id = requestOptionsIds.get(requestOptions);
  if (id !== undefined)
    return id;
  const nextId = requestOptionsId++;
  requestOptionsIds.set(requestOptions, nextId);
  return nextId;
}
async function scheduleMulticall(client, args) {
  const { batchSize = 1024, deployless = false, wait = 0 } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", requireCanonical, data, multicallAddress: multicallAddress_, requestOptions, rpcStateOverride, to } = args;
  const multicallAddress = multicallAddress_ !== undefined ? multicallAddress_ : getMulticallAddress(client, {
    blockNumber,
    deployless
  });
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const blockId = typeof block === "string" ? block : JSON.stringify(block);
  const stateOverrideKey = rpcStateOverride ? `.${JSON.stringify(rpcStateOverride)}` : "";
  const { schedule } = createBatchScheduler({
    id: `${client.uid}.${blockId}.${getRequestOptionsId(requestOptions)}${stateOverrideKey}`,
    wait,
    shouldSplitBatch(args2) {
      const size5 = args2.reduce((size6, { data: data2 }) => size6 + (data2.length - 2), 0);
      return size5 > batchSize * 2;
    },
    fn: async (requests) => {
      const calls = requests.map((request) => ({
        allowFailure: true,
        callData: request.data,
        target: request.to
      }));
      const calldata = encodeFunctionData({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3"
      });
      const multicallRequest = {
        ...multicallAddress === null ? {
          data: toDeploylessCallViaBytecodeData({
            code: multicall3Bytecode,
            data: calldata
          })
        } : { to: multicallAddress, data: calldata }
      };
      const data2 = await client.request({
        method: "eth_call",
        params: rpcStateOverride ? [multicallRequest, block, rpcStateOverride] : [multicallRequest, block]
      }, requestOptions);
      return decodeFunctionResult({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
        data: data2 || "0x"
      });
    }
  });
  const [{ returnData, success }] = await schedule({ data, to });
  if (!success)
    throw new RawContractError({ data: returnData });
  if (returnData === "0x")
    return { data: undefined };
  return { data: returnData };
}
function getMulticallAddress(client, parameters) {
  const { blockNumber, deployless } = parameters;
  if (deployless)
    return null;
  if (client.chain)
    return getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "multicall3"
    });
  throw new ClientChainNotConfiguredError;
}
function hasStateOverrideForAddress(rpcStateOverride, address) {
  if (!rpcStateOverride)
    return false;
  return Object.keys(rpcStateOverride).some((stateOverrideAddress) => isAddressEqual(stateOverrideAddress, address));
}
function toDeploylessCallViaBytecodeData(parameters) {
  const { code, data } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(bytes, bytes)"]),
    bytecode: deploylessCallViaBytecodeBytecode,
    args: [code, data]
  });
}
function toDeploylessCallViaFactoryData(parameters) {
  const { data, factory, factoryData, to } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
    bytecode: deploylessCallViaFactoryBytecode,
    args: [to, data, factory, factoryData]
  });
}
function getRevertErrorData(err) {
  if (!(err instanceof BaseError))
    return;
  const error = err.walk();
  return typeof error?.data === "object" ? error.data?.data : error.data;
}
var requestOptionsId = 0, requestOptionsIds;
var init_call = __esm(() => {
  init_exports();
  init_BlockOverrides();
  init_abis();
  init_base();
  init_chain();
  init_contract();
  init_decodeFunctionResult();
  init_encodeDeployData();
  init_encodeFunctionData();
  init_isAddressEqual();
  init_formatBlockParameter();
  init_getChainContractAddress();
  init_getCallError();
  init_transactionRequest();
  init_createBatchScheduler();
  init_stateOverride2();
  init_assertRequest();
  requestOptionsIds = new WeakMap;
});

// node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD, SHA256_IV;
var init__md = __esm(() => {
  init_utils();
  HashMD = class HashMD extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE2) {
      super();
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE2;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      aexists(this);
      data = toBytes2(data);
      abytes(data);
      const { view, buffer: buffer2, blockLen } = this;
      const len = data.length;
      for (let pos = 0;pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (;blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer2.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      this.finished = true;
      const { buffer: buffer2, view, blockLen, isLE: isLE2 } = this;
      let { pos } = this;
      buffer2[pos++] = 128;
      clean(this.buffer.subarray(pos));
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos;i < blockLen; i++)
        buffer2[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0;i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE2);
    }
    digest() {
      const { buffer: buffer2, outputLen } = this;
      this.digestInto(buffer2);
      const res = buffer2.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor);
      to.set(...this.get());
      const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
      to.destroyed = destroyed;
      to.finished = finished;
      to.length = length;
      to.pos = pos;
      if (length % blockLen)
        to.buffer.set(buffer2);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
  };
  SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
});

// node_modules/@noble/hashes/esm/sha2.js
var SHA256_K, SHA256_W, SHA256, sha2562;
var init_sha2 = __esm(() => {
  init__md();
  init_utils();
  SHA256_K = /* @__PURE__ */ Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  SHA256 = class SHA256 extends HashMD {
    constructor(outputLen = 32) {
      super(64, outputLen, 8, false);
      this.A = SHA256_IV[0] | 0;
      this.B = SHA256_IV[1] | 0;
      this.C = SHA256_IV[2] | 0;
      this.D = SHA256_IV[3] | 0;
      this.E = SHA256_IV[4] | 0;
      this.F = SHA256_IV[5] | 0;
      this.G = SHA256_IV[6] | 0;
      this.H = SHA256_IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0;i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16;i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0;i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      clean(SHA256_W);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      clean(this.buffer);
    }
  };
  sha2562 = /* @__PURE__ */ createHasher(() => new SHA256);
});

// node_modules/@noble/hashes/esm/hmac.js
var HMAC, hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
var init_hmac = __esm(() => {
  init_utils();
  HMAC = class HMAC extends Hash {
    constructor(hash2, _key) {
      super();
      this.finished = false;
      this.destroyed = false;
      ahash(hash2);
      const key = toBytes2(_key);
      this.iHash = hash2.create();
      if (typeof this.iHash.update !== "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen;
      this.outputLen = this.iHash.outputLen;
      const blockLen = this.blockLen;
      const pad4 = new Uint8Array(blockLen);
      pad4.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
      for (let i = 0;i < pad4.length; i++)
        pad4[i] ^= 54;
      this.iHash.update(pad4);
      this.oHash = hash2.create();
      for (let i = 0;i < pad4.length; i++)
        pad4[i] ^= 54 ^ 92;
      this.oHash.update(pad4);
      clean(pad4);
    }
    update(buf) {
      aexists(this);
      this.iHash.update(buf);
      return this;
    }
    digestInto(out) {
      aexists(this);
      abytes(out, this.outputLen);
      this.finished = true;
      this.iHash.digestInto(out);
      this.oHash.update(out);
      this.oHash.digestInto(out);
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.oHash.outputLen);
      this.digestInto(out);
      return out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
      to = to;
      to.finished = finished;
      to.destroyed = destroyed;
      to.blockLen = blockLen;
      to.outputLen = outputLen;
      to.oHash = oHash._cloneInto(to.oHash);
      to.iHash = iHash._cloneInto(to.iHash);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = true;
      this.oHash.destroy();
      this.iHash.destroy();
    }
  };
  hmac.create = (hash2, key) => new HMAC(hash2, key);
});

// node_modules/@noble/curves/esm/abstract/modular.js
function mod(a, b) {
  const result = a % b;
  return result >= _0n3 ? result : b + result;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n3) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n3)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n3)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n3, y = _1n3, u = _1n3, v = _0n3;
  while (a !== _0n3) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n3)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function sqrt3mod4(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n3) / _4n;
  const root = Fp.pow(n, p1div4);
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
  return root;
}
function sqrt5mod8(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n2 = Fp.mul(n, _2n2);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i = Fp.mul(Fp.mul(nv, _2n2), v);
  const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
  return root;
}
function tonelliShanks(P) {
  if (P < BigInt(3))
    throw new Error("sqrt is not defined for small field");
  let Q = P - _1n3;
  let S = 0;
  while (Q % _2n2 === _0n3) {
    Q /= _2n2;
    S++;
  }
  let Z = _2n2;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1000)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n3) / _2n2;
  return function tonelliSlow(Fp, n) {
    if (Fp.is0(n))
      return n;
    if (FpLegendre(Fp, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t))
        return Fp.ZERO;
      let i = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i++;
        t_tmp = Fp.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n3 << BigInt(M - i - 1);
      const b = Fp.pow(c, exponent);
      M = i;
      c = Fp.sqr(b);
      t = Fp.mul(t, c);
      R = Fp.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  return tonelliShanks(P);
}
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(Fp, num, power) {
  if (power < _0n3)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n3)
    return Fp.ONE;
  if (power === _1n3)
    return num;
  let p = Fp.ONE;
  let d = num;
  while (power > _0n3) {
    if (power & _1n3)
      p = Fp.mul(p, d);
    d = Fp.sqr(d);
    power >>= _1n3;
  }
  return p;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : undefined);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (Fp.is0(num))
      return acc;
    inverted[i] = acc;
    return Fp.mul(acc, num);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (Fp.is0(num))
      return acc;
    inverted[i] = Fp.mul(acc, inverted[i]);
    return Fp.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n3) / _2n2;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== undefined)
    anumber(nBitLength);
  const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
  if (ORDER <= _0n3)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE: isLE2,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n3,
    ONE: _1n3,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n3 <= num && num < ORDER;
    },
    is0: (num) => num === _0n3,
    isOdd: (num) => (num & _1n3) === _1n3,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f, n);
    }),
    toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes) => {
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      return isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    },
    invertBatch: (lst) => FpInvertBatch(f, lst),
    cmov: (a, b, c) => c ? b : a
  });
  return Object.freeze(f);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n3) + _1n3;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
var _0n3, _1n3, _2n2, _3n, _4n, _5n, _8n, FIELD_FIELDS;
var init_modular = __esm(() => {
  init_utils();
  init_utils3();
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  _0n3 = BigInt(0);
  _1n3 = BigInt(1);
  _2n2 = /* @__PURE__ */ BigInt(2);
  _3n = /* @__PURE__ */ BigInt(3);
  _4n = /* @__PURE__ */ BigInt(4);
  _5n = /* @__PURE__ */ BigInt(5);
  _8n = /* @__PURE__ */ BigInt(8);
  FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
});

// node_modules/@noble/curves/esm/abstract/curve.js
function constTimeNegate(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window2, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n4;
  }
  const offsetStart = window2 * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window2 % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    if (!field.isValid(s))
      throw new Error("invalid scalar at index " + i);
  });
}
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
function wNAF(c, bits) {
  return {
    constTimeNegate,
    hasPrecomputes(elm) {
      return getW(elm) !== 1;
    },
    unsafeLadder(elm, n, p = c.ZERO) {
      let d = elm;
      while (n > _0n4) {
        if (n & _1n4)
          p = p.add(d);
        d = d.double();
        n >>= _1n4;
      }
      return p;
    },
    precomputeWindow(elm, W) {
      const { windows, windowSize } = calcWOpts(W, bits);
      const points = [];
      let p = elm;
      let base = p;
      for (let window2 = 0;window2 < windows; window2++) {
        base = p;
        points.push(base);
        for (let i = 1;i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    wNAF(W, precomputes, n) {
      let p = c.ZERO;
      let f = c.BASE;
      const wo = calcWOpts(W, bits);
      for (let window2 = 0;window2 < wo.windows; window2++) {
        const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
        n = nextN;
        if (isZero) {
          f = f.add(constTimeNegate(isNegF, precomputes[offsetF]));
        } else {
          p = p.add(constTimeNegate(isNeg, precomputes[offset]));
        }
      }
      return { p, f };
    },
    wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
      const wo = calcWOpts(W, bits);
      for (let window2 = 0;window2 < wo.windows; window2++) {
        if (n === _0n4)
          break;
        const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
        n = nextN;
        if (isZero) {
          continue;
        } else {
          const item = precomputes[offset];
          acc = acc.add(isNeg ? item.negate() : item);
        }
      }
      return acc;
    },
    getPrecomputes(W, P, transform) {
      let comp = pointPrecomputes.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1)
          pointPrecomputes.set(P, transform(comp));
      }
      return comp;
    },
    wNAFCached(P, n, transform) {
      const W = getW(P);
      return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
    },
    wNAFCachedUnsafe(P, n, transform, prev) {
      const W = getW(P);
      if (W === 1)
        return this.unsafeLadder(P, n, prev);
      return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
    },
    setWindowSize(P, W) {
      validateW(W, bits);
      pointWindowSizes.set(P, W);
      pointPrecomputes.delete(P);
    }
  };
}
function pippenger(c, fieldN, points, scalars) {
  validateMSMPoints(points, c);
  validateMSMScalars(scalars, fieldN);
  const plength = points.length;
  const slength = scalars.length;
  if (plength !== slength)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c.ZERO;
  const wbits = bitLen(BigInt(plength));
  let windowSize = 1;
  if (wbits > 12)
    windowSize = wbits - 3;
  else if (wbits > 4)
    windowSize = wbits - 2;
  else if (wbits > 0)
    windowSize = 2;
  const MASK = bitMask(windowSize);
  const buckets = new Array(Number(MASK) + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i = lastBits;i >= 0; i -= windowSize) {
    buckets.fill(zero);
    for (let j = 0;j < slength; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i) & MASK);
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = zero;
    for (let j = buckets.length - 1, sumI = zero;j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j = 0;j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}
var _0n4, _1n4, pointPrecomputes, pointWindowSizes;
var init_curve = __esm(() => {
  init_modular();
  init_utils3();
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  _0n4 = BigInt(0);
  _1n4 = BigInt(1);
  pointPrecomputes = new WeakMap;
  pointWindowSizes = new WeakMap;
});

// node_modules/@noble/curves/esm/abstract/weierstrass.js
function validateSigVerOpts(opts) {
  if (opts.lowS !== undefined)
    abool("lowS", opts.lowS);
  if (opts.prehash !== undefined)
    abool("prehash", opts.prehash);
}
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: "field",
    b: "field"
  }, {
    allowInfinityPoint: "boolean",
    allowedPrivateKeyLengths: "array",
    clearCofactor: "function",
    fromBytes: "function",
    isTorsionFree: "function",
    toBytes: "function",
    wrapPrivateKey: "boolean"
  });
  const { endo, Fp, a } = opts;
  if (endo) {
    if (!Fp.eql(a, Fp.ZERO)) {
      throw new Error("invalid endo: CURVE.a must be 0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
    }
  }
  return Object.freeze({ ...opts });
}
function numToSizedHex(num, size5) {
  return bytesToHex2(numberToBytesBE(num, size5));
}
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp } = CURVE;
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const toBytes3 = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes3(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
  });
  const fromBytes2 = CURVE.fromBytes || ((bytes) => {
    const tail = bytes.subarray(1);
    const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
    const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
    return { x, y };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
  }
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function isWithinCurveOrder(num) {
    return inRange(num, _1n5, CURVE.n);
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (isBytes2(key))
        key = bytesToHex2(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("invalid private key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
    }
    if (wrapPrivateKey)
      num = mod(num, N);
    aInRange("private key", num, _1n5, N);
    return num;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point))
      throw new Error("ProjectivePoint expected");
  }
  const toAffineMemo = memoized((p, iz) => {
    const { px: x, py: y, pz: z } = p;
    if (Fp.eql(z, Fp.ONE))
      return { x, y };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp.ONE : Fp.inv(z);
    const ax = Fp.mul(x, iz);
    const ay = Fp.mul(y, iz);
    const zz = Fp.mul(z, iz);
    if (is0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (!Fp.eql(zz, Fp.ONE))
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (CURVE.allowInfinityPoint && !Fp.is0(p.py))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y))
      throw new Error("bad point: x or y not FE");
    if (!isValidXY(x, y))
      throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });

  class Point {
    constructor(px, py, pz) {
      if (px == null || !Fp.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp.isValid(py) || Fp.is0(py))
        throw new Error("y required");
      if (pz == null || !Fp.isValid(pz))
        throw new Error("z required");
      this.px = px;
      this.py = py;
      this.pz = pz;
      Object.freeze(this);
    }
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point)
        throw new Error("projective point not allowed");
      const is0 = (i) => Fp.eql(i, Fp.ZERO);
      if (is0(x) && is0(y))
        return Point.ZERO;
      return new Point(x, y, Fp.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static normalizeZ(points) {
      const toInv = FpInvertBatch(Fp, points.map((p) => p.pz));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    static fromHex(hex) {
      const P = Point.fromAffine(fromBytes2(ensureBytes("pointHex", hex)));
      P.assertValidity();
      return P;
    }
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    static msm(points, scalars) {
      return pippenger(Point, Fn, points, scalars);
    }
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (Fp.isOdd)
        return !Fp.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    equals(other) {
      aprjpoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    negate() {
      return new Point(this.px, Fp.neg(this.py), this.pz);
    }
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n2);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let { ZERO: X3, ZERO: Y3, ZERO: Z3 } = Fp;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    add(other) {
      aprjpoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let { ZERO: X3, ZERO: Y3, ZERO: Z3 } = Fp;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n2);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point.normalizeZ);
    }
    multiplyUnsafe(sc) {
      const { endo: endo2, n: N } = CURVE;
      aInRange("scalar", sc, _0n5, N);
      const I = Point.ZERO;
      if (sc === _0n5)
        return I;
      if (this.is0() || sc === _1n5)
        return this;
      if (!endo2 || wnaf.hasPrecomputes(this))
        return wnaf.wNAFCachedUnsafe(this, sc, Point.normalizeZ);
      let { k1neg, k1, k2neg, k2 } = endo2.splitScalar(sc);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n5 || k2 > _0n5) {
        if (k1 & _1n5)
          k1p = k1p.add(d);
        if (k2 & _1n5)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n5;
        k2 >>= _1n5;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    multiply(scalar) {
      const { endo: endo2, n: N } = CURVE;
      aInRange("scalar", scalar, _1n5, N);
      let point, fake;
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = endo2.splitScalar(scalar);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f } = this.wNAF(scalar);
        point = p;
        fake = f;
      }
      return Point.normalizeZ([point, fake])[0];
    }
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point.BASE;
      const mul = (P, a2) => a2 === _0n5 || a2 === _1n5 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? undefined : sum;
    }
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n5)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n5)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      abool("isCompressed", isCompressed);
      this.assertValidity();
      return toBytes3(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      abool("isCompressed", isCompressed);
      return bytesToHex2(this.toRawBytes(isCompressed));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
  const { endo, nBitLength } = CURVE;
  const wnaf = wNAF(Point, endo ? Math.ceil(nBitLength / 2) : nBitLength);
  return {
    CURVE,
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  });
  return Object.freeze({ lowS: true, ...opts });
}
function weierstrass(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp, n: CURVE_ORDER, nByteLength, nBitLength } = CURVE;
  const compressedLen = Fp.BYTES + 1;
  const uncompressedLen = 2 * Fp.BYTES + 1;
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp.toBytes(a.x);
      const cat = concatBytes3;
      abool("isCompressed", isCompressed);
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
      } else {
        return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
      }
    },
    fromBytes(bytes) {
      const len = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x = bytesToNumberBE(tail);
        if (!inRange(x, _1n5, Fp.ORDER))
          throw new Error("Point is not on curve");
        const y2 = weierstrassEquation(x);
        let y;
        try {
          y = Fp.sqrt(y2);
        } catch (sqrtError) {
          const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("Point is not on curve" + suffix);
        }
        const isYOdd = (y & _1n5) === _1n5;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y = Fp.neg(y);
        return { x, y };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return { x, y };
      } else {
        const cl = compressedLen;
        const ul = uncompressedLen;
        throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
      }
    }
  });
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n5;
    return number > HALF;
  }
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN(-s) : s;
  }
  const slcNum = (b, from3, to) => bytesToNumberBE(b.slice(from3, to));

  class Signature {
    constructor(r, s, recovery) {
      aInRange("r", r, _1n5, CURVE_ORDER);
      aInRange("s", s, _1n5, CURVE_ORDER);
      this.r = r;
      this.s = s;
      if (recovery != null)
        this.recovery = recovery;
      Object.freeze(this);
    }
    static fromCompact(hex) {
      const l = nByteLength;
      hex = ensureBytes("compactSignature", hex, l * 2);
      return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
    }
    static fromDER(hex) {
      const { r, s } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r, s);
    }
    assertValidity() {}
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r, s, recovery: rec } = this;
      const h = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R = Point.fromHex(prefix + numToSizedHex(radj, Fp.BYTES));
      const ir = invN(radj);
      const u1 = modN(-h * ir);
      const u2 = modN(s * ir);
      const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return hexToBytes2(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig(this);
    }
    toCompactRawBytes() {
      return hexToBytes2(this.toCompactHex());
    }
    toCompactHex() {
      const l = nByteLength;
      return numToSizedHex(this.r, l) + numToSizedHex(this.s, l);
    }
  }
  const utils = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    randomPrivateKey: () => {
      const length = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length), CURVE.n);
    },
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey(privateKey, isCompressed = true) {
    return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function isProbPub(item) {
    if (typeof item === "bigint")
      return false;
    if (item instanceof Point)
      return true;
    const arr = ensureBytes("key", item);
    const len = arr.length;
    const fpl = Fp.BYTES;
    const compLen = fpl + 1;
    const uncompLen = 2 * fpl + 1;
    if (CURVE.allowedPrivateKeyLengths || nByteLength === compLen) {
      return;
    } else {
      return len === compLen || len === uncompLen;
    }
  }
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicB) === false)
      throw new Error("second arg must be public key");
    const b = Point.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  const bits2int = CURVE.bits2int || function(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
    return modN(bits2int(bytes));
  };
  const ORDER_MASK = bitMask(nBitLength);
  function int2octets(num) {
    aInRange("num < 2^" + nBitLength, num, _0n5, ORDER_MASK);
    return numberToBytesBE(num, nByteLength);
  }
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => (k in opts)))
      throw new Error("sign() legacy options not supported");
    const { hash: hash2, randomBytes: randomBytes2 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    validateSigVerOpts(opts);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash2(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (ent != null && ent !== false) {
      const e = ent === true ? randomBytes2(Fp.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes3(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point.BASE.multiply(k).toAffine();
      const r = modN(q.x);
      if (r === _0n5)
        return;
      const s = modN(ik * modN(m + r * d));
      if (s === _0n5)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n5);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    return { seed, k2sig };
  }
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C = CURVE;
    const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig);
  }
  Point.BASE._setWindowSize(8);
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey = ensureBytes("publicKey", publicKey);
    const { lowS, prehash, format: format2 } = opts;
    validateSigVerOpts(opts);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    if (format2 !== undefined && format2 !== "compact" && format2 !== "der")
      throw new Error("format must be compact or der");
    const isHex2 = typeof sg === "string" || isBytes2(sg);
    const isObj = !isHex2 && !format2 && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
    if (!isHex2 && !isObj)
      throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    let _sig = undefined;
    let P;
    try {
      if (isObj)
        _sig = new Signature(sg.r, sg.s);
      if (isHex2) {
        try {
          if (format2 !== "compact")
            _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
        }
        if (!_sig && format2 !== "der")
          _sig = Signature.fromCompact(sg);
      }
      P = Point.fromHex(publicKey);
    } catch (error) {
      return false;
    }
    if (!_sig)
      return false;
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r, s } = _sig;
    const h = bits2int_modN(msgHash);
    const is = invN(s);
    const u1 = modN(h * is);
    const u2 = modN(r * is);
    const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
    if (!R)
      return false;
    const v = modN(R.x);
    return v === r;
  }
  return {
    CURVE,
    getPublicKey,
    getSharedSecret,
    sign,
    verify,
    ProjectivePoint: Point,
    Signature,
    utils
  };
}
function SWUFpSqrtRatio(Fp, Z) {
  const q = Fp.ORDER;
  let l = _0n5;
  for (let o = q - _1n5;o % _2n3 === _0n5; o /= _2n3)
    l += _1n5;
  const c1 = l;
  const _2n_pow_c1_1 = _2n3 << c1 - _1n5 - _1n5;
  const _2n_pow_c1 = _2n_pow_c1_1 * _2n3;
  const c2 = (q - _1n5) / _2n_pow_c1;
  const c3 = (c2 - _1n5) / _2n3;
  const c4 = _2n_pow_c1 - _1n5;
  const c5 = _2n_pow_c1_1;
  const c6 = Fp.pow(Z, c2);
  const c7 = Fp.pow(Z, (c2 + _1n5) / _2n3);
  let sqrtRatio = (u, v) => {
    let tv1 = c6;
    let tv2 = Fp.pow(v, c4);
    let tv3 = Fp.sqr(tv2);
    tv3 = Fp.mul(tv3, v);
    let tv5 = Fp.mul(u, tv3);
    tv5 = Fp.pow(tv5, c3);
    tv5 = Fp.mul(tv5, tv2);
    tv2 = Fp.mul(tv5, v);
    tv3 = Fp.mul(tv5, u);
    let tv4 = Fp.mul(tv3, tv2);
    tv5 = Fp.pow(tv4, c5);
    let isQR = Fp.eql(tv5, Fp.ONE);
    tv2 = Fp.mul(tv3, c7);
    tv5 = Fp.mul(tv4, tv1);
    tv3 = Fp.cmov(tv2, tv3, isQR);
    tv4 = Fp.cmov(tv5, tv4, isQR);
    for (let i = c1;i > _1n5; i--) {
      let tv52 = i - _2n3;
      tv52 = _2n3 << tv52 - _1n5;
      let tvv5 = Fp.pow(tv4, tv52);
      const e1 = Fp.eql(tvv5, Fp.ONE);
      tv2 = Fp.mul(tv3, tv1);
      tv1 = Fp.mul(tv1, tv1);
      tvv5 = Fp.mul(tv4, tv1);
      tv3 = Fp.cmov(tv2, tv3, e1);
      tv4 = Fp.cmov(tvv5, tv4, e1);
    }
    return { isValid: isQR, value: tv3 };
  };
  if (Fp.ORDER % _4n2 === _3n2) {
    const c12 = (Fp.ORDER - _3n2) / _4n2;
    const c22 = Fp.sqrt(Fp.neg(Z));
    sqrtRatio = (u, v) => {
      let tv1 = Fp.sqr(v);
      const tv2 = Fp.mul(u, v);
      tv1 = Fp.mul(tv1, tv2);
      let y1 = Fp.pow(tv1, c12);
      y1 = Fp.mul(y1, tv2);
      const y2 = Fp.mul(y1, c22);
      const tv3 = Fp.mul(Fp.sqr(y1), v);
      const isQR = Fp.eql(tv3, u);
      let y = Fp.cmov(y2, y1, isQR);
      return { isValid: isQR, value: y };
    };
  }
  return sqrtRatio;
}
function mapToCurveSimpleSWU(Fp, opts) {
  validateField(Fp);
  if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
    throw new Error("mapToCurveSimpleSWU: invalid opts");
  const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
  if (!Fp.isOdd)
    throw new Error("Fp.isOdd is not implemented!");
  return (u) => {
    let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
    tv1 = Fp.sqr(u);
    tv1 = Fp.mul(tv1, opts.Z);
    tv2 = Fp.sqr(tv1);
    tv2 = Fp.add(tv2, tv1);
    tv3 = Fp.add(tv2, Fp.ONE);
    tv3 = Fp.mul(tv3, opts.B);
    tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
    tv4 = Fp.mul(tv4, opts.A);
    tv2 = Fp.sqr(tv3);
    tv6 = Fp.sqr(tv4);
    tv5 = Fp.mul(tv6, opts.A);
    tv2 = Fp.add(tv2, tv5);
    tv2 = Fp.mul(tv2, tv3);
    tv6 = Fp.mul(tv6, tv4);
    tv5 = Fp.mul(tv6, opts.B);
    tv2 = Fp.add(tv2, tv5);
    x = Fp.mul(tv1, tv3);
    const { isValid, value } = sqrtRatio(tv2, tv6);
    y = Fp.mul(tv1, u);
    y = Fp.mul(y, value);
    x = Fp.cmov(x, tv3, isValid);
    y = Fp.cmov(y, value, isValid);
    const e1 = Fp.isOdd(u) === Fp.isOdd(y);
    y = Fp.cmov(Fp.neg(y), y, e1);
    const tv4_inv = FpInvertBatch(Fp, [tv4], true)[0];
    x = Fp.mul(x, tv4_inv);
    return { x, y };
  };
}
var DERErr, DER, _0n5, _1n5, _2n3, _3n2, _4n2;
var init_weierstrass = __esm(() => {
  init_curve();
  init_modular();
  init_utils3();
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  DERErr = class DERErr extends Error {
    constructor(m = "") {
      super(m);
    }
  };
  DER = {
    Err: DERErr,
    _tlv: {
      encode: (tag, data) => {
        const { Err: E } = DER;
        if (tag < 0 || tag > 256)
          throw new E("tlv.encode: wrong tag");
        if (data.length & 1)
          throw new E("tlv.encode: unpadded data");
        const dataLen = data.length / 2;
        const len = numberToHexUnpadded(dataLen);
        if (len.length / 2 & 128)
          throw new E("tlv.encode: long form length too big");
        const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
        const t = numberToHexUnpadded(tag);
        return t + lenLen + len + data;
      },
      decode(tag, data) {
        const { Err: E } = DER;
        let pos = 0;
        if (tag < 0 || tag > 256)
          throw new E("tlv.encode: wrong tag");
        if (data.length < 2 || data[pos++] !== tag)
          throw new E("tlv.decode: wrong tlv");
        const first = data[pos++];
        const isLong = !!(first & 128);
        let length = 0;
        if (!isLong)
          length = first;
        else {
          const lenLen = first & 127;
          if (!lenLen)
            throw new E("tlv.decode(long): indefinite length not supported");
          if (lenLen > 4)
            throw new E("tlv.decode(long): byte length is too big");
          const lengthBytes = data.subarray(pos, pos + lenLen);
          if (lengthBytes.length !== lenLen)
            throw new E("tlv.decode: length bytes not complete");
          if (lengthBytes[0] === 0)
            throw new E("tlv.decode(long): zero leftmost byte");
          for (const b of lengthBytes)
            length = length << 8 | b;
          pos += lenLen;
          if (length < 128)
            throw new E("tlv.decode(long): not minimal encoding");
        }
        const v = data.subarray(pos, pos + length);
        if (v.length !== length)
          throw new E("tlv.decode: wrong value length");
        return { v, l: data.subarray(pos + length) };
      }
    },
    _int: {
      encode(num) {
        const { Err: E } = DER;
        if (num < _0n5)
          throw new E("integer: negative integers are not allowed");
        let hex = numberToHexUnpadded(num);
        if (Number.parseInt(hex[0], 16) & 8)
          hex = "00" + hex;
        if (hex.length & 1)
          throw new E("unexpected DER parsing assertion: unpadded hex");
        return hex;
      },
      decode(data) {
        const { Err: E } = DER;
        if (data[0] & 128)
          throw new E("invalid signature integer: negative");
        if (data[0] === 0 && !(data[1] & 128))
          throw new E("invalid signature integer: unnecessary leading zero");
        return bytesToNumberBE(data);
      }
    },
    toSig(hex) {
      const { Err: E, _int: int, _tlv: tlv } = DER;
      const data = ensureBytes("signature", hex);
      const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
      if (seqLeftBytes.length)
        throw new E("invalid signature: left bytes after parsing");
      const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
      const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
      if (sLeftBytes.length)
        throw new E("invalid signature: left bytes after parsing");
      return { r: int.decode(rBytes), s: int.decode(sBytes) };
    },
    hexFromSig(sig) {
      const { _tlv: tlv, _int: int } = DER;
      const rs = tlv.encode(2, int.encode(sig.r));
      const ss = tlv.encode(2, int.encode(sig.s));
      const seq = rs + ss;
      return tlv.encode(48, seq);
    }
  };
  _0n5 = BigInt(0);
  _1n5 = BigInt(1);
  _2n3 = BigInt(2);
  _3n2 = BigInt(3);
  _4n2 = BigInt(4);
});

// node_modules/@noble/curves/esm/_shortw_utils.js
function getHash(hash2) {
  return {
    hash: hash2,
    hmac: (key, ...msgs) => hmac(hash2, key, concatBytes(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create = (hash2) => weierstrass({ ...curveDef, ...getHash(hash2) });
  return { ...create(defHash), create };
}
var init__shortw_utils = __esm(() => {
  init_hmac();
  init_utils();
  init_weierstrass();
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
});

// node_modules/@noble/curves/esm/abstract/hash-to-curve.js
function i2osp(value, length) {
  anum(value);
  anum(length);
  if (value < 0 || value >= 1 << 8 * length)
    throw new Error("invalid I2OSP input: " + value);
  const res = Array.from({ length }).fill(0);
  for (let i = length - 1;i >= 0; i--) {
    res[i] = value & 255;
    value >>>= 8;
  }
  return new Uint8Array(res);
}
function strxor(a, b) {
  const arr = new Uint8Array(a.length);
  for (let i = 0;i < a.length; i++) {
    arr[i] = a[i] ^ b[i];
  }
  return arr;
}
function anum(item) {
  if (!Number.isSafeInteger(item))
    throw new Error("number expected");
}
function expand_message_xmd(msg, DST, lenInBytes, H) {
  abytes2(msg);
  abytes2(DST);
  anum(lenInBytes);
  if (DST.length > 255)
    DST = H(concatBytes3(utf8ToBytes2("H2C-OVERSIZE-DST-"), DST));
  const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
  const ell = Math.ceil(lenInBytes / b_in_bytes);
  if (lenInBytes > 65535 || ell > 255)
    throw new Error("expand_message_xmd: invalid lenInBytes");
  const DST_prime = concatBytes3(DST, i2osp(DST.length, 1));
  const Z_pad = i2osp(0, r_in_bytes);
  const l_i_b_str = i2osp(lenInBytes, 2);
  const b = new Array(ell);
  const b_0 = H(concatBytes3(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
  b[0] = H(concatBytes3(b_0, i2osp(1, 1), DST_prime));
  for (let i = 1;i <= ell; i++) {
    const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
    b[i] = H(concatBytes3(...args));
  }
  const pseudo_random_bytes = concatBytes3(...b);
  return pseudo_random_bytes.slice(0, lenInBytes);
}
function expand_message_xof(msg, DST, lenInBytes, k, H) {
  abytes2(msg);
  abytes2(DST);
  anum(lenInBytes);
  if (DST.length > 255) {
    const dkLen = Math.ceil(2 * k / 8);
    DST = H.create({ dkLen }).update(utf8ToBytes2("H2C-OVERSIZE-DST-")).update(DST).digest();
  }
  if (lenInBytes > 65535 || DST.length > 255)
    throw new Error("expand_message_xof: invalid lenInBytes");
  return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
function hash_to_field(msg, count, options) {
  validateObject(options, {
    DST: "stringOrUint8Array",
    p: "bigint",
    m: "isSafeInteger",
    k: "isSafeInteger",
    hash: "hash"
  });
  const { p, k, m, hash: hash2, expand, DST: _DST } = options;
  abytes2(msg);
  anum(count);
  const DST = typeof _DST === "string" ? utf8ToBytes2(_DST) : _DST;
  const log2p = p.toString(2).length;
  const L = Math.ceil((log2p + k) / 8);
  const len_in_bytes = count * m * L;
  let prb;
  if (expand === "xmd") {
    prb = expand_message_xmd(msg, DST, len_in_bytes, hash2);
  } else if (expand === "xof") {
    prb = expand_message_xof(msg, DST, len_in_bytes, k, hash2);
  } else if (expand === "_internal_pass") {
    prb = msg;
  } else {
    throw new Error('expand must be "xmd" or "xof"');
  }
  const u = new Array(count);
  for (let i = 0;i < count; i++) {
    const e = new Array(m);
    for (let j = 0;j < m; j++) {
      const elm_offset = L * (j + i * m);
      const tv = prb.subarray(elm_offset, elm_offset + L);
      e[j] = mod(os2ip(tv), p);
    }
    u[i] = e;
  }
  return u;
}
function isogenyMap(field, map) {
  const coeff = map.map((i) => Array.from(i).reverse());
  return (x, y) => {
    const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
    const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
    x = field.mul(xn, xd_inv);
    y = field.mul(y, field.mul(yn, yd_inv));
    return { x, y };
  };
}
function createHasher2(Point, mapToCurve, defaults) {
  if (typeof mapToCurve !== "function")
    throw new Error("mapToCurve() must be defined");
  function map(num) {
    return Point.fromAffine(mapToCurve(num));
  }
  function clear(initial) {
    const P = initial.clearCofactor();
    if (P.equals(Point.ZERO))
      return Point.ZERO;
    P.assertValidity();
    return P;
  }
  return {
    defaults,
    hashToCurve(msg, options) {
      const u = hash_to_field(msg, 2, { ...defaults, DST: defaults.DST, ...options });
      const u0 = map(u[0]);
      const u1 = map(u[1]);
      return clear(u0.add(u1));
    },
    encodeToCurve(msg, options) {
      const u = hash_to_field(msg, 1, { ...defaults, DST: defaults.encodeDST, ...options });
      return clear(map(u[0]));
    },
    mapToCurve(scalars) {
      if (!Array.isArray(scalars))
        throw new Error("expected array of bigints");
      for (const i of scalars)
        if (typeof i !== "bigint")
          throw new Error("expected array of bigints");
      return clear(map(scalars));
    }
  };
}
var os2ip;
var init_hash_to_curve = __esm(() => {
  init_modular();
  init_utils3();
  os2ip = bytesToNumberBE;
});

// node_modules/@noble/curves/esm/secp256k1.js
var exports_secp256k1 = {};
__export(exports_secp256k1, {
  secp256k1_hasher: () => secp256k1_hasher,
  secp256k1: () => secp256k1,
  schnorr: () => schnorr,
  hashToCurve: () => hashToCurve,
  encodeToCurve: () => encodeToCurve
});
function sqrtMod(y) {
  const P = secp256k1P;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n3, P) * b3 % P;
  const b9 = pow2(b6, _3n3, P) * b3 % P;
  const b11 = pow2(b9, _2n4, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n3, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n4, P);
  if (!Fpk1.eql(Fpk1.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
function taggedHash(tag, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES[tag];
  if (tagP === undefined) {
    const tagH = sha2562(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
    tagP = concatBytes3(tagH, tagH);
    TAGGED_HASH_PREFIXES[tag] = tagP;
  }
  return sha2562(concatBytes3(tagP, ...messages));
}
function schnorrGetExtPubKey(priv) {
  let d_ = secp256k1.utils.normPrivateKeyToScalar(priv);
  let p = Point.fromPrivateKey(d_);
  const scalar = p.hasEvenY() ? d_ : modN(-d_);
  return { scalar, bytes: pointToBytes(p) };
}
function lift_x(x) {
  aInRange("x", x, _1n6, secp256k1P);
  const xx = modP(x * x);
  const c = modP(xx * x + BigInt(7));
  let y = sqrtMod(c);
  if (y % _2n4 !== _0n6)
    y = modP(-y);
  const p = new Point(x, y, _1n6);
  p.assertValidity();
  return p;
}
function challenge(...args) {
  return modN(num(taggedHash("BIP0340/challenge", ...args)));
}
function schnorrGetPublicKey(privateKey) {
  return schnorrGetExtPubKey(privateKey).bytes;
}
function schnorrSign(message, privateKey, auxRand = randomBytes(32)) {
  const m = ensureBytes("message", message);
  const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey);
  const a = ensureBytes("auxRand", auxRand, 32);
  const t = numTo32b(d ^ num(taggedHash("BIP0340/aux", a)));
  const rand = taggedHash("BIP0340/nonce", t, px, m);
  const k_ = modN(num(rand));
  if (k_ === _0n6)
    throw new Error("sign failed: k is zero");
  const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_);
  const e = challenge(rx, px, m);
  const sig = new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(numTo32b(modN(k + e * d)), 32);
  if (!schnorrVerify(sig, m, px))
    throw new Error("sign: Invalid signature produced");
  return sig;
}
function schnorrVerify(signature, message, publicKey) {
  const sig = ensureBytes("signature", signature, 64);
  const m = ensureBytes("message", message);
  const pub = ensureBytes("publicKey", publicKey, 32);
  try {
    const P = lift_x(num(pub));
    const r = num(sig.subarray(0, 32));
    if (!inRange(r, _1n6, secp256k1P))
      return false;
    const s = num(sig.subarray(32, 64));
    if (!inRange(s, _1n6, secp256k1N))
      return false;
    const e = challenge(numTo32b(r), pointToBytes(P), m);
    const R = GmulAdd(P, s, modN(-e));
    if (!R || !R.hasEvenY() || R.toAffine().x !== r)
      return false;
    return true;
  } catch (error) {
    return false;
  }
}
var secp256k1P, secp256k1N, _0n6, _1n6, _2n4, divNearest = (a, b) => (a + b / _2n4) / b, Fpk1, secp256k1, TAGGED_HASH_PREFIXES, pointToBytes = (point) => point.toRawBytes(true).slice(1), numTo32b = (n) => numberToBytesBE(n, 32), modP = (x) => mod(x, secp256k1P), modN = (x) => mod(x, secp256k1N), Point, GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b), num, schnorr, isoMap, mapSWU, secp256k1_hasher, hashToCurve, encodeToCurve;
var init_secp256k1 = __esm(() => {
  init_sha2();
  init_utils();
  init__shortw_utils();
  init_hash_to_curve();
  init_modular();
  init_utils3();
  init_weierstrass();
  /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
  secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
  _0n6 = BigInt(0);
  _1n6 = BigInt(1);
  _2n4 = BigInt(2);
  Fpk1 = Field(secp256k1P, undefined, undefined, { sqrt: sqrtMod });
  secp256k1 = createCurve({
    a: _0n6,
    b: BigInt(7),
    Fp: Fpk1,
    n: secp256k1N,
    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
    h: BigInt(1),
    lowS: true,
    endo: {
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
      splitScalar: (k) => {
        const n = secp256k1N;
        const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
        const b1 = -_1n6 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
        const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
        const b2 = a1;
        const POW_2_128 = BigInt("0x100000000000000000000000000000000");
        const c1 = divNearest(b2 * k, n);
        const c2 = divNearest(-b1 * k, n);
        let k1 = mod(k - c1 * a1 - c2 * a2, n);
        let k2 = mod(-c1 * b1 - c2 * b2, n);
        const k1neg = k1 > POW_2_128;
        const k2neg = k2 > POW_2_128;
        if (k1neg)
          k1 = n - k1;
        if (k2neg)
          k2 = n - k2;
        if (k1 > POW_2_128 || k2 > POW_2_128) {
          throw new Error("splitScalar: Endomorphism failed, k=" + k);
        }
        return { k1neg, k1, k2neg, k2 };
      }
    }
  }, sha2562);
  TAGGED_HASH_PREFIXES = {};
  Point = /* @__PURE__ */ (() => secp256k1.ProjectivePoint)();
  num = bytesToNumberBE;
  schnorr = /* @__PURE__ */ (() => ({
    getPublicKey: schnorrGetPublicKey,
    sign: schnorrSign,
    verify: schnorrVerify,
    utils: {
      randomPrivateKey: secp256k1.utils.randomPrivateKey,
      lift_x,
      pointToBytes,
      numberToBytesBE,
      bytesToNumberBE,
      taggedHash,
      mod
    }
  }))();
  isoMap = /* @__PURE__ */ (() => isogenyMap(Fpk1, [
    [
      "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
      "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
      "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
      "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
    ],
    [
      "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
      "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ],
    [
      "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
      "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
      "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
      "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
    ],
    [
      "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
      "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
      "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    ]
  ].map((i) => i.map((j) => BigInt(j)))))();
  mapSWU = /* @__PURE__ */ (() => mapToCurveSimpleSWU(Fpk1, {
    A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
    B: BigInt("1771"),
    Z: Fpk1.create(BigInt("-11"))
  }))();
  secp256k1_hasher = /* @__PURE__ */ (() => createHasher2(secp256k1.ProjectivePoint, (scalars) => {
    const { x, y } = mapSWU(Fpk1.create(scalars[0]));
    return isoMap(x, y);
  }, {
    DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
    encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
    p: Fpk1.ORDER,
    m: 1,
    k: 128,
    expand: "xmd",
    hash: sha2562
  }))();
  hashToCurve = /* @__PURE__ */ (() => secp256k1_hasher.hashToCurve)();
  encodeToCurve = /* @__PURE__ */ (() => secp256k1_hasher.encodeToCurve)();
});

// node_modules/bn.js/lib/bn.js
var require_bn = __commonJS((exports, module) => {
  (function(module2, exports2) {
    function assert8(val, msg) {
      if (!val)
        throw new Error(msg || "Assertion failed");
    }
    function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor;
      ctor.prototype.constructor = ctor;
    }
    function BN(number, base, endian) {
      if (BN.isBN(number)) {
        return number;
      }
      this.negative = 0;
      this.words = null;
      this.length = 0;
      this.red = null;
      if (number !== null) {
        if (base === "le" || base === "be") {
          endian = base;
          base = 10;
        }
        this._init(number || 0, base || 10, endian || "be");
      }
    }
    if (typeof module2 === "object") {
      module2.exports = BN;
    } else {
      exports2.BN = BN;
    }
    BN.BN = BN;
    BN.wordSize = 26;
    var Buffer2;
    try {
      if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
        Buffer2 = window.Buffer;
      } else {
        Buffer2 = __require("buffer").Buffer;
      }
    } catch (e) {}
    BN.isBN = function isBN(num2) {
      if (num2 instanceof BN) {
        return true;
      }
      return num2 !== null && typeof num2 === "object" && num2.constructor.wordSize === BN.wordSize && Array.isArray(num2.words);
    };
    BN.max = function max(left, right) {
      if (left.cmp(right) > 0)
        return left;
      return right;
    };
    BN.min = function min(left, right) {
      if (left.cmp(right) < 0)
        return left;
      return right;
    };
    BN.prototype._init = function init(number, base, endian) {
      if (typeof number === "number") {
        return this._initNumber(number, base, endian);
      }
      if (typeof number === "object") {
        return this._initArray(number, base, endian);
      }
      if (base === "hex") {
        base = 16;
      }
      assert8(base === (base | 0) && base >= 2 && base <= 36);
      number = number.toString().replace(/\s+/g, "");
      var start = 0;
      if (number[0] === "-") {
        start++;
        this.negative = 1;
      }
      if (start < number.length) {
        if (base === 16) {
          this._parseHex(number, start, endian);
        } else {
          this._parseBase(number, base, start);
          if (endian === "le") {
            this._initArray(this.toArray(), base, endian);
          }
        }
      }
    };
    BN.prototype._initNumber = function _initNumber(number, base, endian) {
      if (number < 0) {
        this.negative = 1;
        number = -number;
      }
      if (number < 67108864) {
        this.words = [number & 67108863];
        this.length = 1;
      } else if (number < 4503599627370496) {
        this.words = [
          number & 67108863,
          number / 67108864 & 67108863
        ];
        this.length = 2;
      } else {
        assert8(number < 9007199254740992);
        this.words = [
          number & 67108863,
          number / 67108864 & 67108863,
          1
        ];
        this.length = 3;
      }
      if (endian !== "le")
        return;
      this._initArray(this.toArray(), base, endian);
    };
    BN.prototype._initArray = function _initArray(number, base, endian) {
      assert8(typeof number.length === "number");
      if (number.length <= 0) {
        this.words = [0];
        this.length = 1;
        return this;
      }
      this.length = Math.ceil(number.length / 3);
      this.words = new Array(this.length);
      for (var i = 0;i < this.length; i++) {
        this.words[i] = 0;
      }
      var j, w;
      var off = 0;
      if (endian === "be") {
        for (i = number.length - 1, j = 0;i >= 0; i -= 3) {
          w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
          this.words[j] |= w << off & 67108863;
          this.words[j + 1] = w >>> 26 - off & 67108863;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      } else if (endian === "le") {
        for (i = 0, j = 0;i < number.length; i += 3) {
          w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
          this.words[j] |= w << off & 67108863;
          this.words[j + 1] = w >>> 26 - off & 67108863;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      }
      return this._strip();
    };
    function parseHex4Bits(string, index2) {
      var c = string.charCodeAt(index2);
      if (c >= 48 && c <= 57) {
        return c - 48;
      } else if (c >= 65 && c <= 70) {
        return c - 55;
      } else if (c >= 97 && c <= 102) {
        return c - 87;
      } else {
        assert8(false, "Invalid character in " + string);
      }
    }
    function parseHexByte(string, lowerBound, index2) {
      var r = parseHex4Bits(string, index2);
      if (index2 - 1 >= lowerBound) {
        r |= parseHex4Bits(string, index2 - 1) << 4;
      }
      return r;
    }
    BN.prototype._parseHex = function _parseHex(number, start, endian) {
      this.length = Math.ceil((number.length - start) / 6);
      this.words = new Array(this.length);
      for (var i = 0;i < this.length; i++) {
        this.words[i] = 0;
      }
      var off = 0;
      var j = 0;
      var w;
      if (endian === "be") {
        for (i = number.length - 1;i >= start; i -= 2) {
          w = parseHexByte(number, start, i) << off;
          this.words[j] |= w & 67108863;
          if (off >= 18) {
            off -= 18;
            j += 1;
            this.words[j] |= w >>> 26;
          } else {
            off += 8;
          }
        }
      } else {
        var parseLength = number.length - start;
        for (i = parseLength % 2 === 0 ? start + 1 : start;i < number.length; i += 2) {
          w = parseHexByte(number, start, i) << off;
          this.words[j] |= w & 67108863;
          if (off >= 18) {
            off -= 18;
            j += 1;
            this.words[j] |= w >>> 26;
          } else {
            off += 8;
          }
        }
      }
      this._strip();
    };
    function parseBase(str, start, end, mul) {
      var r = 0;
      var b = 0;
      var len = Math.min(str.length, end);
      for (var i = start;i < len; i++) {
        var c = str.charCodeAt(i) - 48;
        r *= mul;
        if (c >= 49) {
          b = c - 49 + 10;
        } else if (c >= 17) {
          b = c - 17 + 10;
        } else {
          b = c;
        }
        assert8(c >= 0 && b < mul, "Invalid character");
        r += b;
      }
      return r;
    }
    BN.prototype._parseBase = function _parseBase(number, base, start) {
      this.words = [0];
      this.length = 1;
      for (var limbLen = 0, limbPow = 1;limbPow <= 67108863; limbPow *= base) {
        limbLen++;
      }
      limbLen--;
      limbPow = limbPow / base | 0;
      var total = number.length - start;
      var mod2 = total % limbLen;
      var end = Math.min(total, total - mod2) + start;
      var word = 0;
      for (var i = start;i < end; i += limbLen) {
        word = parseBase(number, i, i + limbLen, base);
        this.imuln(limbPow);
        if (this.words[0] + word < 67108864) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
      if (mod2 !== 0) {
        var pow = 1;
        word = parseBase(number, i, number.length, base);
        for (i = 0;i < mod2; i++) {
          pow *= base;
        }
        this.imuln(pow);
        if (this.words[0] + word < 67108864) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
      this._strip();
    };
    BN.prototype.copy = function copy(dest) {
      dest.words = new Array(this.length);
      for (var i = 0;i < this.length; i++) {
        dest.words[i] = this.words[i];
      }
      dest.length = this.length;
      dest.negative = this.negative;
      dest.red = this.red;
    };
    function move(dest, src) {
      dest.words = src.words;
      dest.length = src.length;
      dest.negative = src.negative;
      dest.red = src.red;
    }
    BN.prototype._move = function _move(dest) {
      move(dest, this);
    };
    BN.prototype.clone = function clone() {
      var r = new BN(null);
      this.copy(r);
      return r;
    };
    BN.prototype._expand = function _expand(size7) {
      while (this.length < size7) {
        this.words[this.length++] = 0;
      }
      return this;
    };
    BN.prototype._strip = function strip() {
      while (this.length > 1 && this.words[this.length - 1] === 0) {
        this.length--;
      }
      return this._normSign();
    };
    BN.prototype._normSign = function _normSign() {
      if (this.length === 1 && this.words[0] === 0) {
        this.negative = 0;
      }
      return this;
    };
    if (typeof Symbol !== "undefined" && typeof Symbol.for === "function") {
      try {
        BN.prototype[Symbol.for("nodejs.util.inspect.custom")] = inspect;
      } catch (e) {
        BN.prototype.inspect = inspect;
      }
    } else {
      BN.prototype.inspect = inspect;
    }
    function inspect() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    }
    var zeros = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ];
    var groupSizes = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ];
    var groupBases = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64000000,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      24300000,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    BN.prototype.toString = function toString2(base, padding) {
      base = base || 10;
      padding = padding | 0 || 1;
      var out;
      if (base === 16 || base === "hex") {
        out = "";
        var off = 0;
        var carry = 0;
        for (var i = 0;i < this.length; i++) {
          var w = this.words[i];
          var word = ((w << off | carry) & 16777215).toString(16);
          carry = w >>> 24 - off & 16777215;
          off += 2;
          if (off >= 26) {
            off -= 26;
            i--;
          }
          if (carry !== 0 || i !== this.length - 1) {
            out = zeros[6 - word.length] + word + out;
          } else {
            out = word + out;
          }
        }
        if (carry !== 0) {
          out = carry.toString(16) + out;
        }
        while (out.length % padding !== 0) {
          out = "0" + out;
        }
        if (this.negative !== 0) {
          out = "-" + out;
        }
        return out;
      }
      if (base === (base | 0) && base >= 2 && base <= 36) {
        var groupSize = groupSizes[base];
        var groupBase = groupBases[base];
        out = "";
        var c = this.clone();
        c.negative = 0;
        while (!c.isZero()) {
          var r = c.modrn(groupBase).toString(base);
          c = c.idivn(groupBase);
          if (!c.isZero()) {
            out = zeros[groupSize - r.length] + r + out;
          } else {
            out = r + out;
          }
        }
        if (this.isZero()) {
          out = "0" + out;
        }
        while (out.length % padding !== 0) {
          out = "0" + out;
        }
        if (this.negative !== 0) {
          out = "-" + out;
        }
        return out;
      }
      assert8(false, "Base should be between 2 and 36");
    };
    BN.prototype.toNumber = function toNumber3() {
      var ret = this.words[0];
      if (this.length === 2) {
        ret += this.words[1] * 67108864;
      } else if (this.length === 3 && this.words[2] === 1) {
        ret += 4503599627370496 + this.words[1] * 67108864;
      } else if (this.length > 2) {
        assert8(false, "Number can only safely store up to 53 bits");
      }
      return this.negative !== 0 ? -ret : ret;
    };
    BN.prototype.toJSON = function toJSON() {
      return this.toString(16, 2);
    };
    if (Buffer2) {
      BN.prototype.toBuffer = function toBuffer(endian, length) {
        return this.toArrayLike(Buffer2, endian, length);
      };
    }
    BN.prototype.toArray = function toArray(endian, length) {
      return this.toArrayLike(Array, endian, length);
    };
    var allocate = function allocate2(ArrayType, size7) {
      if (ArrayType.allocUnsafe) {
        return ArrayType.allocUnsafe(size7);
      }
      return new ArrayType(size7);
    };
    BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
      this._strip();
      var byteLength = this.byteLength();
      var reqLength = length || Math.max(1, byteLength);
      assert8(byteLength <= reqLength, "byte array longer than desired length");
      assert8(reqLength > 0, "Requested array length <= 0");
      var res = allocate(ArrayType, reqLength);
      var postfix = endian === "le" ? "LE" : "BE";
      this["_toArrayLike" + postfix](res, byteLength);
      return res;
    };
    BN.prototype._toArrayLikeLE = function _toArrayLikeLE(res, byteLength) {
      var position = 0;
      var carry = 0;
      for (var i = 0, shift = 0;i < this.length; i++) {
        var word = this.words[i] << shift | carry;
        res[position++] = word & 255;
        if (position < res.length) {
          res[position++] = word >> 8 & 255;
        }
        if (position < res.length) {
          res[position++] = word >> 16 & 255;
        }
        if (shift === 6) {
          if (position < res.length) {
            res[position++] = word >> 24 & 255;
          }
          carry = 0;
          shift = 0;
        } else {
          carry = word >>> 24;
          shift += 2;
        }
      }
      if (position < res.length) {
        res[position++] = carry;
        while (position < res.length) {
          res[position++] = 0;
        }
      }
    };
    BN.prototype._toArrayLikeBE = function _toArrayLikeBE(res, byteLength) {
      var position = res.length - 1;
      var carry = 0;
      for (var i = 0, shift = 0;i < this.length; i++) {
        var word = this.words[i] << shift | carry;
        res[position--] = word & 255;
        if (position >= 0) {
          res[position--] = word >> 8 & 255;
        }
        if (position >= 0) {
          res[position--] = word >> 16 & 255;
        }
        if (shift === 6) {
          if (position >= 0) {
            res[position--] = word >> 24 & 255;
          }
          carry = 0;
          shift = 0;
        } else {
          carry = word >>> 24;
          shift += 2;
        }
      }
      if (position >= 0) {
        res[position--] = carry;
        while (position >= 0) {
          res[position--] = 0;
        }
      }
    };
    if (Math.clz32) {
      BN.prototype._countBits = function _countBits(w) {
        return 32 - Math.clz32(w);
      };
    } else {
      BN.prototype._countBits = function _countBits(w) {
        var t = w;
        var r = 0;
        if (t >= 4096) {
          r += 13;
          t >>>= 13;
        }
        if (t >= 64) {
          r += 7;
          t >>>= 7;
        }
        if (t >= 8) {
          r += 4;
          t >>>= 4;
        }
        if (t >= 2) {
          r += 2;
          t >>>= 2;
        }
        return r + t;
      };
    }
    BN.prototype._zeroBits = function _zeroBits(w) {
      if (w === 0)
        return 26;
      var t = w;
      var r = 0;
      if ((t & 8191) === 0) {
        r += 13;
        t >>>= 13;
      }
      if ((t & 127) === 0) {
        r += 7;
        t >>>= 7;
      }
      if ((t & 15) === 0) {
        r += 4;
        t >>>= 4;
      }
      if ((t & 3) === 0) {
        r += 2;
        t >>>= 2;
      }
      if ((t & 1) === 0) {
        r++;
      }
      return r;
    };
    BN.prototype.bitLength = function bitLength() {
      var w = this.words[this.length - 1];
      var hi = this._countBits(w);
      return (this.length - 1) * 26 + hi;
    };
    function toBitArray(num2) {
      var w = new Array(num2.bitLength());
      for (var bit = 0;bit < w.length; bit++) {
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        w[bit] = num2.words[off] >>> wbit & 1;
      }
      return w;
    }
    BN.prototype.zeroBits = function zeroBits() {
      if (this.isZero())
        return 0;
      var r = 0;
      for (var i = 0;i < this.length; i++) {
        var b = this._zeroBits(this.words[i]);
        r += b;
        if (b !== 26)
          break;
      }
      return r;
    };
    BN.prototype.byteLength = function byteLength() {
      return Math.ceil(this.bitLength() / 8);
    };
    BN.prototype.toTwos = function toTwos(width) {
      if (this.negative !== 0) {
        return this.abs().inotn(width).iaddn(1);
      }
      return this.clone();
    };
    BN.prototype.fromTwos = function fromTwos(width) {
      if (this.testn(width - 1)) {
        return this.notn(width).iaddn(1).ineg();
      }
      return this.clone();
    };
    BN.prototype.isNeg = function isNeg() {
      return this.negative !== 0;
    };
    BN.prototype.neg = function neg() {
      return this.clone().ineg();
    };
    BN.prototype.ineg = function ineg() {
      if (!this.isZero()) {
        this.negative ^= 1;
      }
      return this;
    };
    BN.prototype.iuor = function iuor(num2) {
      while (this.length < num2.length) {
        this.words[this.length++] = 0;
      }
      for (var i = 0;i < num2.length; i++) {
        this.words[i] = this.words[i] | num2.words[i];
      }
      return this._strip();
    };
    BN.prototype.ior = function ior(num2) {
      assert8((this.negative | num2.negative) === 0);
      return this.iuor(num2);
    };
    BN.prototype.or = function or(num2) {
      if (this.length > num2.length)
        return this.clone().ior(num2);
      return num2.clone().ior(this);
    };
    BN.prototype.uor = function uor(num2) {
      if (this.length > num2.length)
        return this.clone().iuor(num2);
      return num2.clone().iuor(this);
    };
    BN.prototype.iuand = function iuand(num2) {
      var b;
      if (this.length > num2.length) {
        b = num2;
      } else {
        b = this;
      }
      for (var i = 0;i < b.length; i++) {
        this.words[i] = this.words[i] & num2.words[i];
      }
      this.length = b.length;
      return this._strip();
    };
    BN.prototype.iand = function iand(num2) {
      assert8((this.negative | num2.negative) === 0);
      return this.iuand(num2);
    };
    BN.prototype.and = function and(num2) {
      if (this.length > num2.length)
        return this.clone().iand(num2);
      return num2.clone().iand(this);
    };
    BN.prototype.uand = function uand(num2) {
      if (this.length > num2.length)
        return this.clone().iuand(num2);
      return num2.clone().iuand(this);
    };
    BN.prototype.iuxor = function iuxor(num2) {
      var a;
      var b;
      if (this.length > num2.length) {
        a = this;
        b = num2;
      } else {
        a = num2;
        b = this;
      }
      for (var i = 0;i < b.length; i++) {
        this.words[i] = a.words[i] ^ b.words[i];
      }
      if (this !== a) {
        for (;i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }
      this.length = a.length;
      return this._strip();
    };
    BN.prototype.ixor = function ixor(num2) {
      assert8((this.negative | num2.negative) === 0);
      return this.iuxor(num2);
    };
    BN.prototype.xor = function xor(num2) {
      if (this.length > num2.length)
        return this.clone().ixor(num2);
      return num2.clone().ixor(this);
    };
    BN.prototype.uxor = function uxor(num2) {
      if (this.length > num2.length)
        return this.clone().iuxor(num2);
      return num2.clone().iuxor(this);
    };
    BN.prototype.inotn = function inotn(width) {
      assert8(typeof width === "number" && width >= 0);
      var bytesNeeded = Math.ceil(width / 26) | 0;
      var bitsLeft = width % 26;
      this._expand(bytesNeeded);
      if (bitsLeft > 0) {
        bytesNeeded--;
      }
      for (var i = 0;i < bytesNeeded; i++) {
        this.words[i] = ~this.words[i] & 67108863;
      }
      if (bitsLeft > 0) {
        this.words[i] = ~this.words[i] & 67108863 >> 26 - bitsLeft;
        i++;
      }
      for (;i < this.length; i++) {
        this.words[i] = 0;
      }
      return this._strip();
    };
    BN.prototype.notn = function notn(width) {
      return this.clone().inotn(width);
    };
    BN.prototype.setn = function setn(bit, val) {
      assert8(typeof bit === "number" && bit >= 0);
      var off = bit / 26 | 0;
      var wbit = bit % 26;
      this._expand(off + 1);
      if (val) {
        this.words[off] = this.words[off] | 1 << wbit;
      } else {
        this.words[off] = this.words[off] & ~(1 << wbit);
      }
      return this._strip();
    };
    BN.prototype.iadd = function iadd(num2) {
      var r;
      if (this.negative !== 0 && num2.negative === 0) {
        this.negative = 0;
        r = this.isub(num2);
        this.negative ^= 1;
        return this._normSign();
      } else if (this.negative === 0 && num2.negative !== 0) {
        num2.negative = 0;
        r = this.isub(num2);
        num2.negative = 1;
        return r._normSign();
      }
      var a, b;
      if (this.length > num2.length) {
        a = this;
        b = num2;
      } else {
        a = num2;
        b = this;
      }
      var carry = 0;
      for (var i = 0;i < b.length; i++) {
        r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
        this.words[i] = r & 67108863;
        carry = r >>> 26;
      }
      for (;carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        this.words[i] = r & 67108863;
        carry = r >>> 26;
      }
      this.length = a.length;
      if (carry !== 0) {
        this.words[this.length] = carry;
        this.length++;
      } else if (a !== this) {
        for (;i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }
      return this;
    };
    BN.prototype.add = function add(num2) {
      var res;
      if (num2.negative !== 0 && this.negative === 0) {
        num2.negative = 0;
        res = this.sub(num2);
        num2.negative ^= 1;
        return res;
      } else if (num2.negative === 0 && this.negative !== 0) {
        this.negative = 0;
        res = num2.sub(this);
        this.negative = 1;
        return res;
      }
      if (this.length > num2.length)
        return this.clone().iadd(num2);
      return num2.clone().iadd(this);
    };
    BN.prototype.isub = function isub(num2) {
      if (num2.negative !== 0) {
        num2.negative = 0;
        var r = this.iadd(num2);
        num2.negative = 1;
        return r._normSign();
      } else if (this.negative !== 0) {
        this.negative = 0;
        this.iadd(num2);
        this.negative = 1;
        return this._normSign();
      }
      var cmp = this.cmp(num2);
      if (cmp === 0) {
        this.negative = 0;
        this.length = 1;
        this.words[0] = 0;
        return this;
      }
      var a, b;
      if (cmp > 0) {
        a = this;
        b = num2;
      } else {
        a = num2;
        b = this;
      }
      var carry = 0;
      for (var i = 0;i < b.length; i++) {
        r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 67108863;
      }
      for (;carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 67108863;
      }
      if (carry === 0 && i < a.length && a !== this) {
        for (;i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }
      this.length = Math.max(this.length, i);
      if (a !== this) {
        this.negative = 1;
      }
      return this._strip();
    };
    BN.prototype.sub = function sub(num2) {
      return this.clone().isub(num2);
    };
    function smallMulTo(self2, num2, out) {
      out.negative = num2.negative ^ self2.negative;
      var len = self2.length + num2.length | 0;
      out.length = len;
      len = len - 1 | 0;
      var a = self2.words[0] | 0;
      var b = num2.words[0] | 0;
      var r = a * b;
      var lo = r & 67108863;
      var carry = r / 67108864 | 0;
      out.words[0] = lo;
      for (var k = 1;k < len; k++) {
        var ncarry = carry >>> 26;
        var rword = carry & 67108863;
        var maxJ = Math.min(k, num2.length - 1);
        for (var j = Math.max(0, k - self2.length + 1);j <= maxJ; j++) {
          var i = k - j | 0;
          a = self2.words[i] | 0;
          b = num2.words[j] | 0;
          r = a * b + rword;
          ncarry += r / 67108864 | 0;
          rword = r & 67108863;
        }
        out.words[k] = rword | 0;
        carry = ncarry | 0;
      }
      if (carry !== 0) {
        out.words[k] = carry | 0;
      } else {
        out.length--;
      }
      return out._strip();
    }
    var comb10MulTo = function comb10MulTo2(self2, num2, out) {
      var a = self2.words;
      var b = num2.words;
      var o = out.words;
      var c = 0;
      var lo;
      var mid;
      var hi;
      var a0 = a[0] | 0;
      var al0 = a0 & 8191;
      var ah0 = a0 >>> 13;
      var a1 = a[1] | 0;
      var al1 = a1 & 8191;
      var ah1 = a1 >>> 13;
      var a2 = a[2] | 0;
      var al2 = a2 & 8191;
      var ah2 = a2 >>> 13;
      var a3 = a[3] | 0;
      var al3 = a3 & 8191;
      var ah3 = a3 >>> 13;
      var a4 = a[4] | 0;
      var al4 = a4 & 8191;
      var ah4 = a4 >>> 13;
      var a5 = a[5] | 0;
      var al5 = a5 & 8191;
      var ah5 = a5 >>> 13;
      var a6 = a[6] | 0;
      var al6 = a6 & 8191;
      var ah6 = a6 >>> 13;
      var a7 = a[7] | 0;
      var al7 = a7 & 8191;
      var ah7 = a7 >>> 13;
      var a8 = a[8] | 0;
      var al8 = a8 & 8191;
      var ah8 = a8 >>> 13;
      var a9 = a[9] | 0;
      var al9 = a9 & 8191;
      var ah9 = a9 >>> 13;
      var b0 = b[0] | 0;
      var bl0 = b0 & 8191;
      var bh0 = b0 >>> 13;
      var b1 = b[1] | 0;
      var bl1 = b1 & 8191;
      var bh1 = b1 >>> 13;
      var b2 = b[2] | 0;
      var bl2 = b2 & 8191;
      var bh2 = b2 >>> 13;
      var b3 = b[3] | 0;
      var bl3 = b3 & 8191;
      var bh3 = b3 >>> 13;
      var b4 = b[4] | 0;
      var bl4 = b4 & 8191;
      var bh4 = b4 >>> 13;
      var b5 = b[5] | 0;
      var bl5 = b5 & 8191;
      var bh5 = b5 >>> 13;
      var b6 = b[6] | 0;
      var bl6 = b6 & 8191;
      var bh6 = b6 >>> 13;
      var b7 = b[7] | 0;
      var bl7 = b7 & 8191;
      var bh7 = b7 >>> 13;
      var b8 = b[8] | 0;
      var bl8 = b8 & 8191;
      var bh8 = b8 >>> 13;
      var b9 = b[9] | 0;
      var bl9 = b9 & 8191;
      var bh9 = b9 >>> 13;
      out.negative = self2.negative ^ num2.negative;
      out.length = 19;
      lo = Math.imul(al0, bl0);
      mid = Math.imul(al0, bh0);
      mid = mid + Math.imul(ah0, bl0) | 0;
      hi = Math.imul(ah0, bh0);
      var w0 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
      w0 &= 67108863;
      lo = Math.imul(al1, bl0);
      mid = Math.imul(al1, bh0);
      mid = mid + Math.imul(ah1, bl0) | 0;
      hi = Math.imul(ah1, bh0);
      lo = lo + Math.imul(al0, bl1) | 0;
      mid = mid + Math.imul(al0, bh1) | 0;
      mid = mid + Math.imul(ah0, bl1) | 0;
      hi = hi + Math.imul(ah0, bh1) | 0;
      var w1 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
      w1 &= 67108863;
      lo = Math.imul(al2, bl0);
      mid = Math.imul(al2, bh0);
      mid = mid + Math.imul(ah2, bl0) | 0;
      hi = Math.imul(ah2, bh0);
      lo = lo + Math.imul(al1, bl1) | 0;
      mid = mid + Math.imul(al1, bh1) | 0;
      mid = mid + Math.imul(ah1, bl1) | 0;
      hi = hi + Math.imul(ah1, bh1) | 0;
      lo = lo + Math.imul(al0, bl2) | 0;
      mid = mid + Math.imul(al0, bh2) | 0;
      mid = mid + Math.imul(ah0, bl2) | 0;
      hi = hi + Math.imul(ah0, bh2) | 0;
      var w2 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
      w2 &= 67108863;
      lo = Math.imul(al3, bl0);
      mid = Math.imul(al3, bh0);
      mid = mid + Math.imul(ah3, bl0) | 0;
      hi = Math.imul(ah3, bh0);
      lo = lo + Math.imul(al2, bl1) | 0;
      mid = mid + Math.imul(al2, bh1) | 0;
      mid = mid + Math.imul(ah2, bl1) | 0;
      hi = hi + Math.imul(ah2, bh1) | 0;
      lo = lo + Math.imul(al1, bl2) | 0;
      mid = mid + Math.imul(al1, bh2) | 0;
      mid = mid + Math.imul(ah1, bl2) | 0;
      hi = hi + Math.imul(ah1, bh2) | 0;
      lo = lo + Math.imul(al0, bl3) | 0;
      mid = mid + Math.imul(al0, bh3) | 0;
      mid = mid + Math.imul(ah0, bl3) | 0;
      hi = hi + Math.imul(ah0, bh3) | 0;
      var w3 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
      w3 &= 67108863;
      lo = Math.imul(al4, bl0);
      mid = Math.imul(al4, bh0);
      mid = mid + Math.imul(ah4, bl0) | 0;
      hi = Math.imul(ah4, bh0);
      lo = lo + Math.imul(al3, bl1) | 0;
      mid = mid + Math.imul(al3, bh1) | 0;
      mid = mid + Math.imul(ah3, bl1) | 0;
      hi = hi + Math.imul(ah3, bh1) | 0;
      lo = lo + Math.imul(al2, bl2) | 0;
      mid = mid + Math.imul(al2, bh2) | 0;
      mid = mid + Math.imul(ah2, bl2) | 0;
      hi = hi + Math.imul(ah2, bh2) | 0;
      lo = lo + Math.imul(al1, bl3) | 0;
      mid = mid + Math.imul(al1, bh3) | 0;
      mid = mid + Math.imul(ah1, bl3) | 0;
      hi = hi + Math.imul(ah1, bh3) | 0;
      lo = lo + Math.imul(al0, bl4) | 0;
      mid = mid + Math.imul(al0, bh4) | 0;
      mid = mid + Math.imul(ah0, bl4) | 0;
      hi = hi + Math.imul(ah0, bh4) | 0;
      var w4 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
      w4 &= 67108863;
      lo = Math.imul(al5, bl0);
      mid = Math.imul(al5, bh0);
      mid = mid + Math.imul(ah5, bl0) | 0;
      hi = Math.imul(ah5, bh0);
      lo = lo + Math.imul(al4, bl1) | 0;
      mid = mid + Math.imul(al4, bh1) | 0;
      mid = mid + Math.imul(ah4, bl1) | 0;
      hi = hi + Math.imul(ah4, bh1) | 0;
      lo = lo + Math.imul(al3, bl2) | 0;
      mid = mid + Math.imul(al3, bh2) | 0;
      mid = mid + Math.imul(ah3, bl2) | 0;
      hi = hi + Math.imul(ah3, bh2) | 0;
      lo = lo + Math.imul(al2, bl3) | 0;
      mid = mid + Math.imul(al2, bh3) | 0;
      mid = mid + Math.imul(ah2, bl3) | 0;
      hi = hi + Math.imul(ah2, bh3) | 0;
      lo = lo + Math.imul(al1, bl4) | 0;
      mid = mid + Math.imul(al1, bh4) | 0;
      mid = mid + Math.imul(ah1, bl4) | 0;
      hi = hi + Math.imul(ah1, bh4) | 0;
      lo = lo + Math.imul(al0, bl5) | 0;
      mid = mid + Math.imul(al0, bh5) | 0;
      mid = mid + Math.imul(ah0, bl5) | 0;
      hi = hi + Math.imul(ah0, bh5) | 0;
      var w5 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
      w5 &= 67108863;
      lo = Math.imul(al6, bl0);
      mid = Math.imul(al6, bh0);
      mid = mid + Math.imul(ah6, bl0) | 0;
      hi = Math.imul(ah6, bh0);
      lo = lo + Math.imul(al5, bl1) | 0;
      mid = mid + Math.imul(al5, bh1) | 0;
      mid = mid + Math.imul(ah5, bl1) | 0;
      hi = hi + Math.imul(ah5, bh1) | 0;
      lo = lo + Math.imul(al4, bl2) | 0;
      mid = mid + Math.imul(al4, bh2) | 0;
      mid = mid + Math.imul(ah4, bl2) | 0;
      hi = hi + Math.imul(ah4, bh2) | 0;
      lo = lo + Math.imul(al3, bl3) | 0;
      mid = mid + Math.imul(al3, bh3) | 0;
      mid = mid + Math.imul(ah3, bl3) | 0;
      hi = hi + Math.imul(ah3, bh3) | 0;
      lo = lo + Math.imul(al2, bl4) | 0;
      mid = mid + Math.imul(al2, bh4) | 0;
      mid = mid + Math.imul(ah2, bl4) | 0;
      hi = hi + Math.imul(ah2, bh4) | 0;
      lo = lo + Math.imul(al1, bl5) | 0;
      mid = mid + Math.imul(al1, bh5) | 0;
      mid = mid + Math.imul(ah1, bl5) | 0;
      hi = hi + Math.imul(ah1, bh5) | 0;
      lo = lo + Math.imul(al0, bl6) | 0;
      mid = mid + Math.imul(al0, bh6) | 0;
      mid = mid + Math.imul(ah0, bl6) | 0;
      hi = hi + Math.imul(ah0, bh6) | 0;
      var w6 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
      w6 &= 67108863;
      lo = Math.imul(al7, bl0);
      mid = Math.imul(al7, bh0);
      mid = mid + Math.imul(ah7, bl0) | 0;
      hi = Math.imul(ah7, bh0);
      lo = lo + Math.imul(al6, bl1) | 0;
      mid = mid + Math.imul(al6, bh1) | 0;
      mid = mid + Math.imul(ah6, bl1) | 0;
      hi = hi + Math.imul(ah6, bh1) | 0;
      lo = lo + Math.imul(al5, bl2) | 0;
      mid = mid + Math.imul(al5, bh2) | 0;
      mid = mid + Math.imul(ah5, bl2) | 0;
      hi = hi + Math.imul(ah5, bh2) | 0;
      lo = lo + Math.imul(al4, bl3) | 0;
      mid = mid + Math.imul(al4, bh3) | 0;
      mid = mid + Math.imul(ah4, bl3) | 0;
      hi = hi + Math.imul(ah4, bh3) | 0;
      lo = lo + Math.imul(al3, bl4) | 0;
      mid = mid + Math.imul(al3, bh4) | 0;
      mid = mid + Math.imul(ah3, bl4) | 0;
      hi = hi + Math.imul(ah3, bh4) | 0;
      lo = lo + Math.imul(al2, bl5) | 0;
      mid = mid + Math.imul(al2, bh5) | 0;
      mid = mid + Math.imul(ah2, bl5) | 0;
      hi = hi + Math.imul(ah2, bh5) | 0;
      lo = lo + Math.imul(al1, bl6) | 0;
      mid = mid + Math.imul(al1, bh6) | 0;
      mid = mid + Math.imul(ah1, bl6) | 0;
      hi = hi + Math.imul(ah1, bh6) | 0;
      lo = lo + Math.imul(al0, bl7) | 0;
      mid = mid + Math.imul(al0, bh7) | 0;
      mid = mid + Math.imul(ah0, bl7) | 0;
      hi = hi + Math.imul(ah0, bh7) | 0;
      var w7 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
      w7 &= 67108863;
      lo = Math.imul(al8, bl0);
      mid = Math.imul(al8, bh0);
      mid = mid + Math.imul(ah8, bl0) | 0;
      hi = Math.imul(ah8, bh0);
      lo = lo + Math.imul(al7, bl1) | 0;
      mid = mid + Math.imul(al7, bh1) | 0;
      mid = mid + Math.imul(ah7, bl1) | 0;
      hi = hi + Math.imul(ah7, bh1) | 0;
      lo = lo + Math.imul(al6, bl2) | 0;
      mid = mid + Math.imul(al6, bh2) | 0;
      mid = mid + Math.imul(ah6, bl2) | 0;
      hi = hi + Math.imul(ah6, bh2) | 0;
      lo = lo + Math.imul(al5, bl3) | 0;
      mid = mid + Math.imul(al5, bh3) | 0;
      mid = mid + Math.imul(ah5, bl3) | 0;
      hi = hi + Math.imul(ah5, bh3) | 0;
      lo = lo + Math.imul(al4, bl4) | 0;
      mid = mid + Math.imul(al4, bh4) | 0;
      mid = mid + Math.imul(ah4, bl4) | 0;
      hi = hi + Math.imul(ah4, bh4) | 0;
      lo = lo + Math.imul(al3, bl5) | 0;
      mid = mid + Math.imul(al3, bh5) | 0;
      mid = mid + Math.imul(ah3, bl5) | 0;
      hi = hi + Math.imul(ah3, bh5) | 0;
      lo = lo + Math.imul(al2, bl6) | 0;
      mid = mid + Math.imul(al2, bh6) | 0;
      mid = mid + Math.imul(ah2, bl6) | 0;
      hi = hi + Math.imul(ah2, bh6) | 0;
      lo = lo + Math.imul(al1, bl7) | 0;
      mid = mid + Math.imul(al1, bh7) | 0;
      mid = mid + Math.imul(ah1, bl7) | 0;
      hi = hi + Math.imul(ah1, bh7) | 0;
      lo = lo + Math.imul(al0, bl8) | 0;
      mid = mid + Math.imul(al0, bh8) | 0;
      mid = mid + Math.imul(ah0, bl8) | 0;
      hi = hi + Math.imul(ah0, bh8) | 0;
      var w8 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
      w8 &= 67108863;
      lo = Math.imul(al9, bl0);
      mid = Math.imul(al9, bh0);
      mid = mid + Math.imul(ah9, bl0) | 0;
      hi = Math.imul(ah9, bh0);
      lo = lo + Math.imul(al8, bl1) | 0;
      mid = mid + Math.imul(al8, bh1) | 0;
      mid = mid + Math.imul(ah8, bl1) | 0;
      hi = hi + Math.imul(ah8, bh1) | 0;
      lo = lo + Math.imul(al7, bl2) | 0;
      mid = mid + Math.imul(al7, bh2) | 0;
      mid = mid + Math.imul(ah7, bl2) | 0;
      hi = hi + Math.imul(ah7, bh2) | 0;
      lo = lo + Math.imul(al6, bl3) | 0;
      mid = mid + Math.imul(al6, bh3) | 0;
      mid = mid + Math.imul(ah6, bl3) | 0;
      hi = hi + Math.imul(ah6, bh3) | 0;
      lo = lo + Math.imul(al5, bl4) | 0;
      mid = mid + Math.imul(al5, bh4) | 0;
      mid = mid + Math.imul(ah5, bl4) | 0;
      hi = hi + Math.imul(ah5, bh4) | 0;
      lo = lo + Math.imul(al4, bl5) | 0;
      mid = mid + Math.imul(al4, bh5) | 0;
      mid = mid + Math.imul(ah4, bl5) | 0;
      hi = hi + Math.imul(ah4, bh5) | 0;
      lo = lo + Math.imul(al3, bl6) | 0;
      mid = mid + Math.imul(al3, bh6) | 0;
      mid = mid + Math.imul(ah3, bl6) | 0;
      hi = hi + Math.imul(ah3, bh6) | 0;
      lo = lo + Math.imul(al2, bl7) | 0;
      mid = mid + Math.imul(al2, bh7) | 0;
      mid = mid + Math.imul(ah2, bl7) | 0;
      hi = hi + Math.imul(ah2, bh7) | 0;
      lo = lo + Math.imul(al1, bl8) | 0;
      mid = mid + Math.imul(al1, bh8) | 0;
      mid = mid + Math.imul(ah1, bl8) | 0;
      hi = hi + Math.imul(ah1, bh8) | 0;
      lo = lo + Math.imul(al0, bl9) | 0;
      mid = mid + Math.imul(al0, bh9) | 0;
      mid = mid + Math.imul(ah0, bl9) | 0;
      hi = hi + Math.imul(ah0, bh9) | 0;
      var w9 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
      w9 &= 67108863;
      lo = Math.imul(al9, bl1);
      mid = Math.imul(al9, bh1);
      mid = mid + Math.imul(ah9, bl1) | 0;
      hi = Math.imul(ah9, bh1);
      lo = lo + Math.imul(al8, bl2) | 0;
      mid = mid + Math.imul(al8, bh2) | 0;
      mid = mid + Math.imul(ah8, bl2) | 0;
      hi = hi + Math.imul(ah8, bh2) | 0;
      lo = lo + Math.imul(al7, bl3) | 0;
      mid = mid + Math.imul(al7, bh3) | 0;
      mid = mid + Math.imul(ah7, bl3) | 0;
      hi = hi + Math.imul(ah7, bh3) | 0;
      lo = lo + Math.imul(al6, bl4) | 0;
      mid = mid + Math.imul(al6, bh4) | 0;
      mid = mid + Math.imul(ah6, bl4) | 0;
      hi = hi + Math.imul(ah6, bh4) | 0;
      lo = lo + Math.imul(al5, bl5) | 0;
      mid = mid + Math.imul(al5, bh5) | 0;
      mid = mid + Math.imul(ah5, bl5) | 0;
      hi = hi + Math.imul(ah5, bh5) | 0;
      lo = lo + Math.imul(al4, bl6) | 0;
      mid = mid + Math.imul(al4, bh6) | 0;
      mid = mid + Math.imul(ah4, bl6) | 0;
      hi = hi + Math.imul(ah4, bh6) | 0;
      lo = lo + Math.imul(al3, bl7) | 0;
      mid = mid + Math.imul(al3, bh7) | 0;
      mid = mid + Math.imul(ah3, bl7) | 0;
      hi = hi + Math.imul(ah3, bh7) | 0;
      lo = lo + Math.imul(al2, bl8) | 0;
      mid = mid + Math.imul(al2, bh8) | 0;
      mid = mid + Math.imul(ah2, bl8) | 0;
      hi = hi + Math.imul(ah2, bh8) | 0;
      lo = lo + Math.imul(al1, bl9) | 0;
      mid = mid + Math.imul(al1, bh9) | 0;
      mid = mid + Math.imul(ah1, bl9) | 0;
      hi = hi + Math.imul(ah1, bh9) | 0;
      var w10 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
      w10 &= 67108863;
      lo = Math.imul(al9, bl2);
      mid = Math.imul(al9, bh2);
      mid = mid + Math.imul(ah9, bl2) | 0;
      hi = Math.imul(ah9, bh2);
      lo = lo + Math.imul(al8, bl3) | 0;
      mid = mid + Math.imul(al8, bh3) | 0;
      mid = mid + Math.imul(ah8, bl3) | 0;
      hi = hi + Math.imul(ah8, bh3) | 0;
      lo = lo + Math.imul(al7, bl4) | 0;
      mid = mid + Math.imul(al7, bh4) | 0;
      mid = mid + Math.imul(ah7, bl4) | 0;
      hi = hi + Math.imul(ah7, bh4) | 0;
      lo = lo + Math.imul(al6, bl5) | 0;
      mid = mid + Math.imul(al6, bh5) | 0;
      mid = mid + Math.imul(ah6, bl5) | 0;
      hi = hi + Math.imul(ah6, bh5) | 0;
      lo = lo + Math.imul(al5, bl6) | 0;
      mid = mid + Math.imul(al5, bh6) | 0;
      mid = mid + Math.imul(ah5, bl6) | 0;
      hi = hi + Math.imul(ah5, bh6) | 0;
      lo = lo + Math.imul(al4, bl7) | 0;
      mid = mid + Math.imul(al4, bh7) | 0;
      mid = mid + Math.imul(ah4, bl7) | 0;
      hi = hi + Math.imul(ah4, bh7) | 0;
      lo = lo + Math.imul(al3, bl8) | 0;
      mid = mid + Math.imul(al3, bh8) | 0;
      mid = mid + Math.imul(ah3, bl8) | 0;
      hi = hi + Math.imul(ah3, bh8) | 0;
      lo = lo + Math.imul(al2, bl9) | 0;
      mid = mid + Math.imul(al2, bh9) | 0;
      mid = mid + Math.imul(ah2, bl9) | 0;
      hi = hi + Math.imul(ah2, bh9) | 0;
      var w11 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
      w11 &= 67108863;
      lo = Math.imul(al9, bl3);
      mid = Math.imul(al9, bh3);
      mid = mid + Math.imul(ah9, bl3) | 0;
      hi = Math.imul(ah9, bh3);
      lo = lo + Math.imul(al8, bl4) | 0;
      mid = mid + Math.imul(al8, bh4) | 0;
      mid = mid + Math.imul(ah8, bl4) | 0;
      hi = hi + Math.imul(ah8, bh4) | 0;
      lo = lo + Math.imul(al7, bl5) | 0;
      mid = mid + Math.imul(al7, bh5) | 0;
      mid = mid + Math.imul(ah7, bl5) | 0;
      hi = hi + Math.imul(ah7, bh5) | 0;
      lo = lo + Math.imul(al6, bl6) | 0;
      mid = mid + Math.imul(al6, bh6) | 0;
      mid = mid + Math.imul(ah6, bl6) | 0;
      hi = hi + Math.imul(ah6, bh6) | 0;
      lo = lo + Math.imul(al5, bl7) | 0;
      mid = mid + Math.imul(al5, bh7) | 0;
      mid = mid + Math.imul(ah5, bl7) | 0;
      hi = hi + Math.imul(ah5, bh7) | 0;
      lo = lo + Math.imul(al4, bl8) | 0;
      mid = mid + Math.imul(al4, bh8) | 0;
      mid = mid + Math.imul(ah4, bl8) | 0;
      hi = hi + Math.imul(ah4, bh8) | 0;
      lo = lo + Math.imul(al3, bl9) | 0;
      mid = mid + Math.imul(al3, bh9) | 0;
      mid = mid + Math.imul(ah3, bl9) | 0;
      hi = hi + Math.imul(ah3, bh9) | 0;
      var w12 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
      w12 &= 67108863;
      lo = Math.imul(al9, bl4);
      mid = Math.imul(al9, bh4);
      mid = mid + Math.imul(ah9, bl4) | 0;
      hi = Math.imul(ah9, bh4);
      lo = lo + Math.imul(al8, bl5) | 0;
      mid = mid + Math.imul(al8, bh5) | 0;
      mid = mid + Math.imul(ah8, bl5) | 0;
      hi = hi + Math.imul(ah8, bh5) | 0;
      lo = lo + Math.imul(al7, bl6) | 0;
      mid = mid + Math.imul(al7, bh6) | 0;
      mid = mid + Math.imul(ah7, bl6) | 0;
      hi = hi + Math.imul(ah7, bh6) | 0;
      lo = lo + Math.imul(al6, bl7) | 0;
      mid = mid + Math.imul(al6, bh7) | 0;
      mid = mid + Math.imul(ah6, bl7) | 0;
      hi = hi + Math.imul(ah6, bh7) | 0;
      lo = lo + Math.imul(al5, bl8) | 0;
      mid = mid + Math.imul(al5, bh8) | 0;
      mid = mid + Math.imul(ah5, bl8) | 0;
      hi = hi + Math.imul(ah5, bh8) | 0;
      lo = lo + Math.imul(al4, bl9) | 0;
      mid = mid + Math.imul(al4, bh9) | 0;
      mid = mid + Math.imul(ah4, bl9) | 0;
      hi = hi + Math.imul(ah4, bh9) | 0;
      var w13 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
      w13 &= 67108863;
      lo = Math.imul(al9, bl5);
      mid = Math.imul(al9, bh5);
      mid = mid + Math.imul(ah9, bl5) | 0;
      hi = Math.imul(ah9, bh5);
      lo = lo + Math.imul(al8, bl6) | 0;
      mid = mid + Math.imul(al8, bh6) | 0;
      mid = mid + Math.imul(ah8, bl6) | 0;
      hi = hi + Math.imul(ah8, bh6) | 0;
      lo = lo + Math.imul(al7, bl7) | 0;
      mid = mid + Math.imul(al7, bh7) | 0;
      mid = mid + Math.imul(ah7, bl7) | 0;
      hi = hi + Math.imul(ah7, bh7) | 0;
      lo = lo + Math.imul(al6, bl8) | 0;
      mid = mid + Math.imul(al6, bh8) | 0;
      mid = mid + Math.imul(ah6, bl8) | 0;
      hi = hi + Math.imul(ah6, bh8) | 0;
      lo = lo + Math.imul(al5, bl9) | 0;
      mid = mid + Math.imul(al5, bh9) | 0;
      mid = mid + Math.imul(ah5, bl9) | 0;
      hi = hi + Math.imul(ah5, bh9) | 0;
      var w14 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
      w14 &= 67108863;
      lo = Math.imul(al9, bl6);
      mid = Math.imul(al9, bh6);
      mid = mid + Math.imul(ah9, bl6) | 0;
      hi = Math.imul(ah9, bh6);
      lo = lo + Math.imul(al8, bl7) | 0;
      mid = mid + Math.imul(al8, bh7) | 0;
      mid = mid + Math.imul(ah8, bl7) | 0;
      hi = hi + Math.imul(ah8, bh7) | 0;
      lo = lo + Math.imul(al7, bl8) | 0;
      mid = mid + Math.imul(al7, bh8) | 0;
      mid = mid + Math.imul(ah7, bl8) | 0;
      hi = hi + Math.imul(ah7, bh8) | 0;
      lo = lo + Math.imul(al6, bl9) | 0;
      mid = mid + Math.imul(al6, bh9) | 0;
      mid = mid + Math.imul(ah6, bl9) | 0;
      hi = hi + Math.imul(ah6, bh9) | 0;
      var w15 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
      w15 &= 67108863;
      lo = Math.imul(al9, bl7);
      mid = Math.imul(al9, bh7);
      mid = mid + Math.imul(ah9, bl7) | 0;
      hi = Math.imul(ah9, bh7);
      lo = lo + Math.imul(al8, bl8) | 0;
      mid = mid + Math.imul(al8, bh8) | 0;
      mid = mid + Math.imul(ah8, bl8) | 0;
      hi = hi + Math.imul(ah8, bh8) | 0;
      lo = lo + Math.imul(al7, bl9) | 0;
      mid = mid + Math.imul(al7, bh9) | 0;
      mid = mid + Math.imul(ah7, bl9) | 0;
      hi = hi + Math.imul(ah7, bh9) | 0;
      var w16 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
      w16 &= 67108863;
      lo = Math.imul(al9, bl8);
      mid = Math.imul(al9, bh8);
      mid = mid + Math.imul(ah9, bl8) | 0;
      hi = Math.imul(ah9, bh8);
      lo = lo + Math.imul(al8, bl9) | 0;
      mid = mid + Math.imul(al8, bh9) | 0;
      mid = mid + Math.imul(ah8, bl9) | 0;
      hi = hi + Math.imul(ah8, bh9) | 0;
      var w17 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
      w17 &= 67108863;
      lo = Math.imul(al9, bl9);
      mid = Math.imul(al9, bh9);
      mid = mid + Math.imul(ah9, bl9) | 0;
      hi = Math.imul(ah9, bh9);
      var w18 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
      w18 &= 67108863;
      o[0] = w0;
      o[1] = w1;
      o[2] = w2;
      o[3] = w3;
      o[4] = w4;
      o[5] = w5;
      o[6] = w6;
      o[7] = w7;
      o[8] = w8;
      o[9] = w9;
      o[10] = w10;
      o[11] = w11;
      o[12] = w12;
      o[13] = w13;
      o[14] = w14;
      o[15] = w15;
      o[16] = w16;
      o[17] = w17;
      o[18] = w18;
      if (c !== 0) {
        o[19] = c;
        out.length++;
      }
      return out;
    };
    if (!Math.imul) {
      comb10MulTo = smallMulTo;
    }
    function bigMulTo(self2, num2, out) {
      out.negative = num2.negative ^ self2.negative;
      out.length = self2.length + num2.length;
      var carry = 0;
      var hncarry = 0;
      for (var k = 0;k < out.length - 1; k++) {
        var ncarry = hncarry;
        hncarry = 0;
        var rword = carry & 67108863;
        var maxJ = Math.min(k, num2.length - 1);
        for (var j = Math.max(0, k - self2.length + 1);j <= maxJ; j++) {
          var i = k - j;
          var a = self2.words[i] | 0;
          var b = num2.words[j] | 0;
          var r = a * b;
          var lo = r & 67108863;
          ncarry = ncarry + (r / 67108864 | 0) | 0;
          lo = lo + rword | 0;
          rword = lo & 67108863;
          ncarry = ncarry + (lo >>> 26) | 0;
          hncarry += ncarry >>> 26;
          ncarry &= 67108863;
        }
        out.words[k] = rword;
        carry = ncarry;
        ncarry = hncarry;
      }
      if (carry !== 0) {
        out.words[k] = carry;
      } else {
        out.length--;
      }
      return out._strip();
    }
    function jumboMulTo(self2, num2, out) {
      return bigMulTo(self2, num2, out);
    }
    BN.prototype.mulTo = function mulTo(num2, out) {
      var res;
      var len = this.length + num2.length;
      if (this.length === 10 && num2.length === 10) {
        res = comb10MulTo(this, num2, out);
      } else if (len < 63) {
        res = smallMulTo(this, num2, out);
      } else if (len < 1024) {
        res = bigMulTo(this, num2, out);
      } else {
        res = jumboMulTo(this, num2, out);
      }
      return res;
    };
    function FFTM(x, y) {
      this.x = x;
      this.y = y;
    }
    FFTM.prototype.makeRBT = function makeRBT(N) {
      var t = new Array(N);
      var l = BN.prototype._countBits(N) - 1;
      for (var i = 0;i < N; i++) {
        t[i] = this.revBin(i, l, N);
      }
      return t;
    };
    FFTM.prototype.revBin = function revBin(x, l, N) {
      if (x === 0 || x === N - 1)
        return x;
      var rb = 0;
      for (var i = 0;i < l; i++) {
        rb |= (x & 1) << l - i - 1;
        x >>= 1;
      }
      return rb;
    };
    FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
      for (var i = 0;i < N; i++) {
        rtws[i] = rws[rbt[i]];
        itws[i] = iws[rbt[i]];
      }
    };
    FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
      this.permute(rbt, rws, iws, rtws, itws, N);
      for (var s = 1;s < N; s <<= 1) {
        var l = s << 1;
        var rtwdf = Math.cos(2 * Math.PI / l);
        var itwdf = Math.sin(2 * Math.PI / l);
        for (var p = 0;p < N; p += l) {
          var rtwdf_ = rtwdf;
          var itwdf_ = itwdf;
          for (var j = 0;j < s; j++) {
            var re = rtws[p + j];
            var ie = itws[p + j];
            var ro = rtws[p + j + s];
            var io = itws[p + j + s];
            var rx = rtwdf_ * ro - itwdf_ * io;
            io = rtwdf_ * io + itwdf_ * ro;
            ro = rx;
            rtws[p + j] = re + ro;
            itws[p + j] = ie + io;
            rtws[p + j + s] = re - ro;
            itws[p + j + s] = ie - io;
            if (j !== l) {
              rx = rtwdf * rtwdf_ - itwdf * itwdf_;
              itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
              rtwdf_ = rx;
            }
          }
        }
      }
    };
    FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
      var N = Math.max(m, n) | 1;
      var odd = N & 1;
      var i = 0;
      for (N = N / 2 | 0;N; N = N >>> 1) {
        i++;
      }
      return 1 << i + 1 + odd;
    };
    FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
      if (N <= 1)
        return;
      for (var i = 0;i < N / 2; i++) {
        var t = rws[i];
        rws[i] = rws[N - i - 1];
        rws[N - i - 1] = t;
        t = iws[i];
        iws[i] = -iws[N - i - 1];
        iws[N - i - 1] = -t;
      }
    };
    FFTM.prototype.normalize13b = function normalize13b(ws, N) {
      var carry = 0;
      for (var i = 0;i < N / 2; i++) {
        var w = Math.round(ws[2 * i + 1] / N) * 8192 + Math.round(ws[2 * i] / N) + carry;
        ws[i] = w & 67108863;
        if (w < 67108864) {
          carry = 0;
        } else {
          carry = w / 67108864 | 0;
        }
      }
      return ws;
    };
    FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
      var carry = 0;
      for (var i = 0;i < len; i++) {
        carry = carry + (ws[i] | 0);
        rws[2 * i] = carry & 8191;
        carry = carry >>> 13;
        rws[2 * i + 1] = carry & 8191;
        carry = carry >>> 13;
      }
      for (i = 2 * len;i < N; ++i) {
        rws[i] = 0;
      }
      assert8(carry === 0);
      assert8((carry & ~8191) === 0);
    };
    FFTM.prototype.stub = function stub(N) {
      var ph = new Array(N);
      for (var i = 0;i < N; i++) {
        ph[i] = 0;
      }
      return ph;
    };
    FFTM.prototype.mulp = function mulp(x, y, out) {
      var N = 2 * this.guessLen13b(x.length, y.length);
      var rbt = this.makeRBT(N);
      var _ = this.stub(N);
      var rws = new Array(N);
      var rwst = new Array(N);
      var iwst = new Array(N);
      var nrws = new Array(N);
      var nrwst = new Array(N);
      var niwst = new Array(N);
      var rmws = out.words;
      rmws.length = N;
      this.convert13b(x.words, x.length, rws, N);
      this.convert13b(y.words, y.length, nrws, N);
      this.transform(rws, _, rwst, iwst, N, rbt);
      this.transform(nrws, _, nrwst, niwst, N, rbt);
      for (var i = 0;i < N; i++) {
        var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
        iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
        rwst[i] = rx;
      }
      this.conjugate(rwst, iwst, N);
      this.transform(rwst, iwst, rmws, _, N, rbt);
      this.conjugate(rmws, _, N);
      this.normalize13b(rmws, N);
      out.negative = x.negative ^ y.negative;
      out.length = x.length + y.length;
      return out._strip();
    };
    BN.prototype.mul = function mul(num2) {
      var out = new BN(null);
      out.words = new Array(this.length + num2.length);
      return this.mulTo(num2, out);
    };
    BN.prototype.mulf = function mulf(num2) {
      var out = new BN(null);
      out.words = new Array(this.length + num2.length);
      return jumboMulTo(this, num2, out);
    };
    BN.prototype.imul = function imul(num2) {
      return this.clone().mulTo(num2, this);
    };
    BN.prototype.imuln = function imuln(num2) {
      var isNegNum = num2 < 0;
      if (isNegNum)
        num2 = -num2;
      assert8(typeof num2 === "number");
      assert8(num2 < 67108864);
      var carry = 0;
      for (var i = 0;i < this.length; i++) {
        var w = (this.words[i] | 0) * num2;
        var lo = (w & 67108863) + (carry & 67108863);
        carry >>= 26;
        carry += w / 67108864 | 0;
        carry += lo >>> 26;
        this.words[i] = lo & 67108863;
      }
      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }
      if (num2 === 0) {
        this.length = 1;
        this._normSign();
      }
      return isNegNum ? this.ineg() : this;
    };
    BN.prototype.muln = function muln(num2) {
      return this.clone().imuln(num2);
    };
    BN.prototype.sqr = function sqr() {
      return this.mul(this);
    };
    BN.prototype.isqr = function isqr() {
      return this.imul(this.clone());
    };
    BN.prototype.pow = function pow(num2) {
      var w = toBitArray(num2);
      if (w.length === 0)
        return new BN(1);
      var res = this;
      for (var i = 0;i < w.length; i++, res = res.sqr()) {
        if (w[i] !== 0)
          break;
      }
      if (++i < w.length) {
        for (var q = res.sqr();i < w.length; i++, q = q.sqr()) {
          if (w[i] === 0)
            continue;
          res = res.mul(q);
        }
      }
      return res;
    };
    BN.prototype.iushln = function iushln(bits) {
      assert8(typeof bits === "number" && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;
      var carryMask = 67108863 >>> 26 - r << 26 - r;
      var i;
      if (r !== 0) {
        var carry = 0;
        for (i = 0;i < this.length; i++) {
          var newCarry = this.words[i] & carryMask;
          var c = (this.words[i] | 0) - newCarry << r;
          this.words[i] = c | carry;
          carry = newCarry >>> 26 - r;
        }
        if (carry) {
          this.words[i] = carry;
          this.length++;
        }
      }
      if (s !== 0) {
        for (i = this.length - 1;i >= 0; i--) {
          this.words[i + s] = this.words[i];
        }
        for (i = 0;i < s; i++) {
          this.words[i] = 0;
        }
        this.length += s;
      }
      return this._strip();
    };
    BN.prototype.ishln = function ishln(bits) {
      assert8(this.negative === 0);
      return this.iushln(bits);
    };
    BN.prototype.iushrn = function iushrn(bits, hint, extended) {
      assert8(typeof bits === "number" && bits >= 0);
      var h;
      if (hint) {
        h = (hint - hint % 26) / 26;
      } else {
        h = 0;
      }
      var r = bits % 26;
      var s = Math.min((bits - r) / 26, this.length);
      var mask = 67108863 ^ 67108863 >>> r << r;
      var maskedWords = extended;
      h -= s;
      h = Math.max(0, h);
      if (maskedWords) {
        for (var i = 0;i < s; i++) {
          maskedWords.words[i] = this.words[i];
        }
        maskedWords.length = s;
      }
      if (s === 0) {} else if (this.length > s) {
        this.length -= s;
        for (i = 0;i < this.length; i++) {
          this.words[i] = this.words[i + s];
        }
      } else {
        this.words[0] = 0;
        this.length = 1;
      }
      var carry = 0;
      for (i = this.length - 1;i >= 0 && (carry !== 0 || i >= h); i--) {
        var word = this.words[i] | 0;
        this.words[i] = carry << 26 - r | word >>> r;
        carry = word & mask;
      }
      if (maskedWords && carry !== 0) {
        maskedWords.words[maskedWords.length++] = carry;
      }
      if (this.length === 0) {
        this.words[0] = 0;
        this.length = 1;
      }
      return this._strip();
    };
    BN.prototype.ishrn = function ishrn(bits, hint, extended) {
      assert8(this.negative === 0);
      return this.iushrn(bits, hint, extended);
    };
    BN.prototype.shln = function shln(bits) {
      return this.clone().ishln(bits);
    };
    BN.prototype.ushln = function ushln(bits) {
      return this.clone().iushln(bits);
    };
    BN.prototype.shrn = function shrn(bits) {
      return this.clone().ishrn(bits);
    };
    BN.prototype.ushrn = function ushrn(bits) {
      return this.clone().iushrn(bits);
    };
    BN.prototype.testn = function testn(bit) {
      assert8(typeof bit === "number" && bit >= 0);
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;
      if (this.length <= s)
        return false;
      var w = this.words[s];
      return !!(w & q);
    };
    BN.prototype.imaskn = function imaskn(bits) {
      assert8(typeof bits === "number" && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;
      assert8(this.negative === 0, "imaskn works only with positive numbers");
      if (this.length <= s) {
        return this;
      }
      if (r !== 0) {
        s++;
      }
      this.length = Math.min(s, this.length);
      if (r !== 0) {
        var mask = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= mask;
      }
      if (this.length === 0) {
        this.words[0] = 0;
        this.length = 1;
      }
      return this._strip();
    };
    BN.prototype.maskn = function maskn(bits) {
      return this.clone().imaskn(bits);
    };
    BN.prototype.iaddn = function iaddn(num2) {
      assert8(typeof num2 === "number");
      assert8(num2 < 67108864);
      if (num2 < 0)
        return this.isubn(-num2);
      if (this.negative !== 0) {
        if (this.length === 1 && (this.words[0] | 0) <= num2) {
          this.words[0] = num2 - (this.words[0] | 0);
          this.negative = 0;
          return this;
        }
        this.negative = 0;
        this.isubn(num2);
        this.negative = 1;
        return this;
      }
      return this._iaddn(num2);
    };
    BN.prototype._iaddn = function _iaddn(num2) {
      this.words[0] += num2;
      for (var i = 0;i < this.length && this.words[i] >= 67108864; i++) {
        this.words[i] -= 67108864;
        if (i === this.length - 1) {
          this.words[i + 1] = 1;
        } else {
          this.words[i + 1]++;
        }
      }
      this.length = Math.max(this.length, i + 1);
      return this;
    };
    BN.prototype.isubn = function isubn(num2) {
      assert8(typeof num2 === "number");
      assert8(num2 < 67108864);
      if (num2 < 0)
        return this.iaddn(-num2);
      if (this.negative !== 0) {
        this.negative = 0;
        this.iaddn(num2);
        this.negative = 1;
        return this;
      }
      this.words[0] -= num2;
      if (this.length === 1 && this.words[0] < 0) {
        this.words[0] = -this.words[0];
        this.negative = 1;
      } else {
        for (var i = 0;i < this.length && this.words[i] < 0; i++) {
          this.words[i] += 67108864;
          this.words[i + 1] -= 1;
        }
      }
      return this._strip();
    };
    BN.prototype.addn = function addn(num2) {
      return this.clone().iaddn(num2);
    };
    BN.prototype.subn = function subn(num2) {
      return this.clone().isubn(num2);
    };
    BN.prototype.iabs = function iabs() {
      this.negative = 0;
      return this;
    };
    BN.prototype.abs = function abs() {
      return this.clone().iabs();
    };
    BN.prototype._ishlnsubmul = function _ishlnsubmul(num2, mul, shift) {
      var len = num2.length + shift;
      var i;
      this._expand(len);
      var w;
      var carry = 0;
      for (i = 0;i < num2.length; i++) {
        w = (this.words[i + shift] | 0) + carry;
        var right = (num2.words[i] | 0) * mul;
        w -= right & 67108863;
        carry = (w >> 26) - (right / 67108864 | 0);
        this.words[i + shift] = w & 67108863;
      }
      for (;i < this.length - shift; i++) {
        w = (this.words[i + shift] | 0) + carry;
        carry = w >> 26;
        this.words[i + shift] = w & 67108863;
      }
      if (carry === 0)
        return this._strip();
      assert8(carry === -1);
      carry = 0;
      for (i = 0;i < this.length; i++) {
        w = -(this.words[i] | 0) + carry;
        carry = w >> 26;
        this.words[i] = w & 67108863;
      }
      this.negative = 1;
      return this._strip();
    };
    BN.prototype._wordDiv = function _wordDiv(num2, mode) {
      var shift = this.length - num2.length;
      var a = this.clone();
      var b = num2;
      var bhi = b.words[b.length - 1] | 0;
      var bhiBits = this._countBits(bhi);
      shift = 26 - bhiBits;
      if (shift !== 0) {
        b = b.ushln(shift);
        a.iushln(shift);
        bhi = b.words[b.length - 1] | 0;
      }
      var m = a.length - b.length;
      var q;
      if (mode !== "mod") {
        q = new BN(null);
        q.length = m + 1;
        q.words = new Array(q.length);
        for (var i = 0;i < q.length; i++) {
          q.words[i] = 0;
        }
      }
      var diff = a.clone()._ishlnsubmul(b, 1, m);
      if (diff.negative === 0) {
        a = diff;
        if (q) {
          q.words[m] = 1;
        }
      }
      for (var j = m - 1;j >= 0; j--) {
        var qj = (a.words[b.length + j] | 0) * 67108864 + (a.words[b.length + j - 1] | 0);
        qj = Math.min(qj / bhi | 0, 67108863);
        a._ishlnsubmul(b, qj, j);
        while (a.negative !== 0) {
          qj--;
          a.negative = 0;
          a._ishlnsubmul(b, 1, j);
          if (!a.isZero()) {
            a.negative ^= 1;
          }
        }
        if (q) {
          q.words[j] = qj;
        }
      }
      if (q) {
        q._strip();
      }
      a._strip();
      if (mode !== "div" && shift !== 0) {
        a.iushrn(shift);
      }
      return {
        div: q || null,
        mod: a
      };
    };
    BN.prototype.divmod = function divmod(num2, mode, positive) {
      assert8(!num2.isZero());
      if (this.isZero()) {
        return {
          div: new BN(0),
          mod: new BN(0)
        };
      }
      var div, mod2, res;
      if (this.negative !== 0 && num2.negative === 0) {
        res = this.neg().divmod(num2, mode);
        if (mode !== "mod") {
          div = res.div.neg();
        }
        if (mode !== "div") {
          mod2 = res.mod.neg();
          if (positive && mod2.negative !== 0) {
            mod2.iadd(num2);
          }
        }
        return {
          div,
          mod: mod2
        };
      }
      if (this.negative === 0 && num2.negative !== 0) {
        res = this.divmod(num2.neg(), mode);
        if (mode !== "mod") {
          div = res.div.neg();
        }
        return {
          div,
          mod: res.mod
        };
      }
      if ((this.negative & num2.negative) !== 0) {
        res = this.neg().divmod(num2.neg(), mode);
        if (mode !== "div") {
          mod2 = res.mod.neg();
          if (positive && mod2.negative !== 0) {
            mod2.isub(num2);
          }
        }
        return {
          div: res.div,
          mod: mod2
        };
      }
      if (num2.length > this.length || this.cmp(num2) < 0) {
        return {
          div: new BN(0),
          mod: this
        };
      }
      if (num2.length === 1) {
        if (mode === "div") {
          return {
            div: this.divn(num2.words[0]),
            mod: null
          };
        }
        if (mode === "mod") {
          return {
            div: null,
            mod: new BN(this.modrn(num2.words[0]))
          };
        }
        return {
          div: this.divn(num2.words[0]),
          mod: new BN(this.modrn(num2.words[0]))
        };
      }
      return this._wordDiv(num2, mode);
    };
    BN.prototype.div = function div(num2) {
      return this.divmod(num2, "div", false).div;
    };
    BN.prototype.mod = function mod2(num2) {
      return this.divmod(num2, "mod", false).mod;
    };
    BN.prototype.umod = function umod(num2) {
      return this.divmod(num2, "mod", true).mod;
    };
    BN.prototype.divRound = function divRound(num2) {
      var dm = this.divmod(num2);
      if (dm.mod.isZero())
        return dm.div;
      var mod2 = dm.mod.abs();
      var half = num2.abs().iushrn(1);
      var r2 = num2.words[0] & 1;
      var cmp = mod2.cmp(half);
      if (cmp < 0 || r2 === 1 && cmp === 0)
        return dm.div;
      var up = new BN(1);
      up.negative = this.negative ^ num2.negative;
      return dm.div.iadd(up);
    };
    BN.prototype.modrn = function modrn(num2) {
      var isNegNum = num2 < 0;
      if (isNegNum)
        num2 = -num2;
      assert8(num2 <= 67108863);
      var p = (1 << 26) % num2;
      var acc = 0;
      for (var i = this.length - 1;i >= 0; i--) {
        acc = (p * acc + (this.words[i] | 0)) % num2;
      }
      return isNegNum ? -acc : acc;
    };
    BN.prototype.modn = function modn(num2) {
      return this.modrn(num2);
    };
    BN.prototype.idivn = function idivn(num2) {
      var isNegNum = num2 < 0;
      if (isNegNum)
        num2 = -num2;
      assert8(num2 <= 67108863);
      var carry = 0;
      for (var i = this.length - 1;i >= 0; i--) {
        var w = (this.words[i] | 0) + carry * 67108864;
        this.words[i] = w / num2 | 0;
        carry = w % num2;
      }
      this._strip();
      return isNegNum ? this.ineg() : this;
    };
    BN.prototype.divn = function divn(num2) {
      return this.clone().idivn(num2);
    };
    BN.prototype.egcd = function egcd(p) {
      assert8(p.negative === 0);
      assert8(!p.isZero());
      var x = this;
      var y = p.clone();
      if (x.negative !== 0) {
        x = x.umod(p);
      } else {
        x = x.clone();
      }
      var A = new BN(1);
      var B = new BN(0);
      var C = new BN(0);
      var D = new BN(1);
      var g = 0;
      while (x.isEven() && y.isEven()) {
        x.iushrn(1);
        y.iushrn(1);
        ++g;
      }
      var yp = y.clone();
      var xp = x.clone();
      while (!x.isZero()) {
        for (var i = 0, im = 1;(x.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
          ;
        if (i > 0) {
          x.iushrn(i);
          while (i-- > 0) {
            if (A.isOdd() || B.isOdd()) {
              A.iadd(yp);
              B.isub(xp);
            }
            A.iushrn(1);
            B.iushrn(1);
          }
        }
        for (var j = 0, jm = 1;(y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
          ;
        if (j > 0) {
          y.iushrn(j);
          while (j-- > 0) {
            if (C.isOdd() || D.isOdd()) {
              C.iadd(yp);
              D.isub(xp);
            }
            C.iushrn(1);
            D.iushrn(1);
          }
        }
        if (x.cmp(y) >= 0) {
          x.isub(y);
          A.isub(C);
          B.isub(D);
        } else {
          y.isub(x);
          C.isub(A);
          D.isub(B);
        }
      }
      return {
        a: C,
        b: D,
        gcd: y.iushln(g)
      };
    };
    BN.prototype._invmp = function _invmp(p) {
      assert8(p.negative === 0);
      assert8(!p.isZero());
      var a = this;
      var b = p.clone();
      if (a.negative !== 0) {
        a = a.umod(p);
      } else {
        a = a.clone();
      }
      var x1 = new BN(1);
      var x2 = new BN(0);
      var delta = b.clone();
      while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
        for (var i = 0, im = 1;(a.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
          ;
        if (i > 0) {
          a.iushrn(i);
          while (i-- > 0) {
            if (x1.isOdd()) {
              x1.iadd(delta);
            }
            x1.iushrn(1);
          }
        }
        for (var j = 0, jm = 1;(b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
          ;
        if (j > 0) {
          b.iushrn(j);
          while (j-- > 0) {
            if (x2.isOdd()) {
              x2.iadd(delta);
            }
            x2.iushrn(1);
          }
        }
        if (a.cmp(b) >= 0) {
          a.isub(b);
          x1.isub(x2);
        } else {
          b.isub(a);
          x2.isub(x1);
        }
      }
      var res;
      if (a.cmpn(1) === 0) {
        res = x1;
      } else {
        res = x2;
      }
      if (res.cmpn(0) < 0) {
        res.iadd(p);
      }
      return res;
    };
    BN.prototype.gcd = function gcd(num2) {
      if (this.isZero())
        return num2.abs();
      if (num2.isZero())
        return this.abs();
      var a = this.clone();
      var b = num2.clone();
      a.negative = 0;
      b.negative = 0;
      for (var shift = 0;a.isEven() && b.isEven(); shift++) {
        a.iushrn(1);
        b.iushrn(1);
      }
      do {
        while (a.isEven()) {
          a.iushrn(1);
        }
        while (b.isEven()) {
          b.iushrn(1);
        }
        var r = a.cmp(b);
        if (r < 0) {
          var t = a;
          a = b;
          b = t;
        } else if (r === 0 || b.cmpn(1) === 0) {
          break;
        }
        a.isub(b);
      } while (true);
      return b.iushln(shift);
    };
    BN.prototype.invm = function invm(num2) {
      return this.egcd(num2).a.umod(num2);
    };
    BN.prototype.isEven = function isEven() {
      return (this.words[0] & 1) === 0;
    };
    BN.prototype.isOdd = function isOdd() {
      return (this.words[0] & 1) === 1;
    };
    BN.prototype.andln = function andln(num2) {
      return this.words[0] & num2;
    };
    BN.prototype.bincn = function bincn(bit) {
      assert8(typeof bit === "number");
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;
      if (this.length <= s) {
        this._expand(s + 1);
        this.words[s] |= q;
        return this;
      }
      var carry = q;
      for (var i = s;carry !== 0 && i < this.length; i++) {
        var w = this.words[i] | 0;
        w += carry;
        carry = w >>> 26;
        w &= 67108863;
        this.words[i] = w;
      }
      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }
      return this;
    };
    BN.prototype.isZero = function isZero() {
      return this.length === 1 && this.words[0] === 0;
    };
    BN.prototype.cmpn = function cmpn(num2) {
      var negative = num2 < 0;
      if (this.negative !== 0 && !negative)
        return -1;
      if (this.negative === 0 && negative)
        return 1;
      this._strip();
      var res;
      if (this.length > 1) {
        res = 1;
      } else {
        if (negative) {
          num2 = -num2;
        }
        assert8(num2 <= 67108863, "Number is too big");
        var w = this.words[0] | 0;
        res = w === num2 ? 0 : w < num2 ? -1 : 1;
      }
      if (this.negative !== 0)
        return -res | 0;
      return res;
    };
    BN.prototype.cmp = function cmp(num2) {
      if (this.negative !== 0 && num2.negative === 0)
        return -1;
      if (this.negative === 0 && num2.negative !== 0)
        return 1;
      var res = this.ucmp(num2);
      if (this.negative !== 0)
        return -res | 0;
      return res;
    };
    BN.prototype.ucmp = function ucmp(num2) {
      if (this.length > num2.length)
        return 1;
      if (this.length < num2.length)
        return -1;
      var res = 0;
      for (var i = this.length - 1;i >= 0; i--) {
        var a = this.words[i] | 0;
        var b = num2.words[i] | 0;
        if (a === b)
          continue;
        if (a < b) {
          res = -1;
        } else if (a > b) {
          res = 1;
        }
        break;
      }
      return res;
    };
    BN.prototype.gtn = function gtn(num2) {
      return this.cmpn(num2) === 1;
    };
    BN.prototype.gt = function gt(num2) {
      return this.cmp(num2) === 1;
    };
    BN.prototype.gten = function gten(num2) {
      return this.cmpn(num2) >= 0;
    };
    BN.prototype.gte = function gte(num2) {
      return this.cmp(num2) >= 0;
    };
    BN.prototype.ltn = function ltn(num2) {
      return this.cmpn(num2) === -1;
    };
    BN.prototype.lt = function lt(num2) {
      return this.cmp(num2) === -1;
    };
    BN.prototype.lten = function lten(num2) {
      return this.cmpn(num2) <= 0;
    };
    BN.prototype.lte = function lte(num2) {
      return this.cmp(num2) <= 0;
    };
    BN.prototype.eqn = function eqn(num2) {
      return this.cmpn(num2) === 0;
    };
    BN.prototype.eq = function eq(num2) {
      return this.cmp(num2) === 0;
    };
    BN.red = function red(num2) {
      return new Red(num2);
    };
    BN.prototype.toRed = function toRed(ctx) {
      assert8(!this.red, "Already a number in reduction context");
      assert8(this.negative === 0, "red works only with positives");
      return ctx.convertTo(this)._forceRed(ctx);
    };
    BN.prototype.fromRed = function fromRed() {
      assert8(this.red, "fromRed works only with numbers in reduction context");
      return this.red.convertFrom(this);
    };
    BN.prototype._forceRed = function _forceRed(ctx) {
      this.red = ctx;
      return this;
    };
    BN.prototype.forceRed = function forceRed(ctx) {
      assert8(!this.red, "Already a number in reduction context");
      return this._forceRed(ctx);
    };
    BN.prototype.redAdd = function redAdd(num2) {
      assert8(this.red, "redAdd works only with red numbers");
      return this.red.add(this, num2);
    };
    BN.prototype.redIAdd = function redIAdd(num2) {
      assert8(this.red, "redIAdd works only with red numbers");
      return this.red.iadd(this, num2);
    };
    BN.prototype.redSub = function redSub(num2) {
      assert8(this.red, "redSub works only with red numbers");
      return this.red.sub(this, num2);
    };
    BN.prototype.redISub = function redISub(num2) {
      assert8(this.red, "redISub works only with red numbers");
      return this.red.isub(this, num2);
    };
    BN.prototype.redShl = function redShl(num2) {
      assert8(this.red, "redShl works only with red numbers");
      return this.red.shl(this, num2);
    };
    BN.prototype.redMul = function redMul(num2) {
      assert8(this.red, "redMul works only with red numbers");
      this.red._verify2(this, num2);
      return this.red.mul(this, num2);
    };
    BN.prototype.redIMul = function redIMul(num2) {
      assert8(this.red, "redMul works only with red numbers");
      this.red._verify2(this, num2);
      return this.red.imul(this, num2);
    };
    BN.prototype.redSqr = function redSqr() {
      assert8(this.red, "redSqr works only with red numbers");
      this.red._verify1(this);
      return this.red.sqr(this);
    };
    BN.prototype.redISqr = function redISqr() {
      assert8(this.red, "redISqr works only with red numbers");
      this.red._verify1(this);
      return this.red.isqr(this);
    };
    BN.prototype.redSqrt = function redSqrt() {
      assert8(this.red, "redSqrt works only with red numbers");
      this.red._verify1(this);
      return this.red.sqrt(this);
    };
    BN.prototype.redInvm = function redInvm() {
      assert8(this.red, "redInvm works only with red numbers");
      this.red._verify1(this);
      return this.red.invm(this);
    };
    BN.prototype.redNeg = function redNeg() {
      assert8(this.red, "redNeg works only with red numbers");
      this.red._verify1(this);
      return this.red.neg(this);
    };
    BN.prototype.redPow = function redPow(num2) {
      assert8(this.red && !num2.red, "redPow(normalNum)");
      this.red._verify1(this);
      return this.red.pow(this, num2);
    };
    var primes = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function MPrime(name, p) {
      this.name = name;
      this.p = new BN(p, 16);
      this.n = this.p.bitLength();
      this.k = new BN(1).iushln(this.n).isub(this.p);
      this.tmp = this._tmp();
    }
    MPrime.prototype._tmp = function _tmp() {
      var tmp = new BN(null);
      tmp.words = new Array(Math.ceil(this.n / 13));
      return tmp;
    };
    MPrime.prototype.ireduce = function ireduce(num2) {
      var r = num2;
      var rlen;
      do {
        this.split(r, this.tmp);
        r = this.imulK(r);
        r = r.iadd(this.tmp);
        rlen = r.bitLength();
      } while (rlen > this.n);
      var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
      if (cmp === 0) {
        r.words[0] = 0;
        r.length = 1;
      } else if (cmp > 0) {
        r.isub(this.p);
      } else {
        if (r.strip !== undefined) {
          r.strip();
        } else {
          r._strip();
        }
      }
      return r;
    };
    MPrime.prototype.split = function split2(input, out) {
      input.iushrn(this.n, 0, out);
    };
    MPrime.prototype.imulK = function imulK(num2) {
      return num2.imul(this.k);
    };
    function K256() {
      MPrime.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
    }
    inherits(K256, MPrime);
    K256.prototype.split = function split2(input, output) {
      var mask = 4194303;
      var outLen = Math.min(input.length, 9);
      for (var i = 0;i < outLen; i++) {
        output.words[i] = input.words[i];
      }
      output.length = outLen;
      if (input.length <= 9) {
        input.words[0] = 0;
        input.length = 1;
        return;
      }
      var prev = input.words[9];
      output.words[output.length++] = prev & mask;
      for (i = 10;i < input.length; i++) {
        var next = input.words[i] | 0;
        input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
        prev = next;
      }
      prev >>>= 22;
      input.words[i - 10] = prev;
      if (prev === 0 && input.length > 10) {
        input.length -= 10;
      } else {
        input.length -= 9;
      }
    };
    K256.prototype.imulK = function imulK(num2) {
      num2.words[num2.length] = 0;
      num2.words[num2.length + 1] = 0;
      num2.length += 2;
      var lo = 0;
      for (var i = 0;i < num2.length; i++) {
        var w = num2.words[i] | 0;
        lo += w * 977;
        num2.words[i] = lo & 67108863;
        lo = w * 64 + (lo / 67108864 | 0);
      }
      if (num2.words[num2.length - 1] === 0) {
        num2.length--;
        if (num2.words[num2.length - 1] === 0) {
          num2.length--;
        }
      }
      return num2;
    };
    function P224() {
      MPrime.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
    }
    inherits(P224, MPrime);
    function P192() {
      MPrime.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
    }
    inherits(P192, MPrime);
    function P25519() {
      MPrime.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
    }
    inherits(P25519, MPrime);
    P25519.prototype.imulK = function imulK(num2) {
      var carry = 0;
      for (var i = 0;i < num2.length; i++) {
        var hi = (num2.words[i] | 0) * 19 + carry;
        var lo = hi & 67108863;
        hi >>>= 26;
        num2.words[i] = lo;
        carry = hi;
      }
      if (carry !== 0) {
        num2.words[num2.length++] = carry;
      }
      return num2;
    };
    BN._prime = function prime(name) {
      if (primes[name])
        return primes[name];
      var prime2;
      if (name === "k256") {
        prime2 = new K256;
      } else if (name === "p224") {
        prime2 = new P224;
      } else if (name === "p192") {
        prime2 = new P192;
      } else if (name === "p25519") {
        prime2 = new P25519;
      } else {
        throw new Error("Unknown prime " + name);
      }
      primes[name] = prime2;
      return prime2;
    };
    function Red(m) {
      if (typeof m === "string") {
        var prime = BN._prime(m);
        this.m = prime.p;
        this.prime = prime;
      } else {
        assert8(m.gtn(1), "modulus must be greater than 1");
        this.m = m;
        this.prime = null;
      }
    }
    Red.prototype._verify1 = function _verify1(a) {
      assert8(a.negative === 0, "red works only with positives");
      assert8(a.red, "red works only with red numbers");
    };
    Red.prototype._verify2 = function _verify2(a, b) {
      assert8((a.negative | b.negative) === 0, "red works only with positives");
      assert8(a.red && a.red === b.red, "red works only with red numbers");
    };
    Red.prototype.imod = function imod(a) {
      if (this.prime)
        return this.prime.ireduce(a)._forceRed(this);
      move(a, a.umod(this.m)._forceRed(this));
      return a;
    };
    Red.prototype.neg = function neg(a) {
      if (a.isZero()) {
        return a.clone();
      }
      return this.m.sub(a)._forceRed(this);
    };
    Red.prototype.add = function add(a, b) {
      this._verify2(a, b);
      var res = a.add(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res._forceRed(this);
    };
    Red.prototype.iadd = function iadd(a, b) {
      this._verify2(a, b);
      var res = a.iadd(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res;
    };
    Red.prototype.sub = function sub(a, b) {
      this._verify2(a, b);
      var res = a.sub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res._forceRed(this);
    };
    Red.prototype.isub = function isub(a, b) {
      this._verify2(a, b);
      var res = a.isub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res;
    };
    Red.prototype.shl = function shl(a, num2) {
      this._verify1(a);
      return this.imod(a.ushln(num2));
    };
    Red.prototype.imul = function imul(a, b) {
      this._verify2(a, b);
      return this.imod(a.imul(b));
    };
    Red.prototype.mul = function mul(a, b) {
      this._verify2(a, b);
      return this.imod(a.mul(b));
    };
    Red.prototype.isqr = function isqr(a) {
      return this.imul(a, a.clone());
    };
    Red.prototype.sqr = function sqr(a) {
      return this.mul(a, a);
    };
    Red.prototype.sqrt = function sqrt(a) {
      if (a.isZero())
        return a.clone();
      var mod3 = this.m.andln(3);
      assert8(mod3 % 2 === 1);
      if (mod3 === 3) {
        var pow = this.m.add(new BN(1)).iushrn(2);
        return this.pow(a, pow);
      }
      var q = this.m.subn(1);
      var s = 0;
      while (!q.isZero() && q.andln(1) === 0) {
        s++;
        q.iushrn(1);
      }
      assert8(!q.isZero());
      var one = new BN(1).toRed(this);
      var nOne = one.redNeg();
      var lpow = this.m.subn(1).iushrn(1);
      var z = this.m.bitLength();
      z = new BN(2 * z * z).toRed(this);
      while (this.pow(z, lpow).cmp(nOne) !== 0) {
        z.redIAdd(nOne);
      }
      var c = this.pow(z, q);
      var r = this.pow(a, q.addn(1).iushrn(1));
      var t = this.pow(a, q);
      var m = s;
      while (t.cmp(one) !== 0) {
        var tmp = t;
        for (var i = 0;tmp.cmp(one) !== 0; i++) {
          tmp = tmp.redSqr();
        }
        assert8(i < m);
        var b = this.pow(c, new BN(1).iushln(m - i - 1));
        r = r.redMul(b);
        c = b.redSqr();
        t = t.redMul(c);
        m = i;
      }
      return r;
    };
    Red.prototype.invm = function invm(a) {
      var inv = a._invmp(this.m);
      if (inv.negative !== 0) {
        inv.negative = 0;
        return this.imod(inv).redNeg();
      } else {
        return this.imod(inv);
      }
    };
    Red.prototype.pow = function pow(a, num2) {
      if (num2.isZero())
        return new BN(1).toRed(this);
      if (num2.cmpn(1) === 0)
        return a.clone();
      var windowSize = 4;
      var wnd = new Array(1 << windowSize);
      wnd[0] = new BN(1).toRed(this);
      wnd[1] = a;
      for (var i = 2;i < wnd.length; i++) {
        wnd[i] = this.mul(wnd[i - 1], a);
      }
      var res = wnd[0];
      var current = 0;
      var currentLen = 0;
      var start = num2.bitLength() % 26;
      if (start === 0) {
        start = 26;
      }
      for (i = num2.length - 1;i >= 0; i--) {
        var word = num2.words[i];
        for (var j = start - 1;j >= 0; j--) {
          var bit = word >> j & 1;
          if (res !== wnd[0]) {
            res = this.sqr(res);
          }
          if (bit === 0 && current === 0) {
            currentLen = 0;
            continue;
          }
          current <<= 1;
          current |= bit;
          currentLen++;
          if (currentLen !== windowSize && (i !== 0 || j !== 0))
            continue;
          res = this.mul(res, wnd[current]);
          currentLen = 0;
          current = 0;
        }
        start = 26;
      }
      return res;
    };
    Red.prototype.convertTo = function convertTo(num2) {
      var r = num2.umod(this.m);
      return r === num2 ? r.clone() : r;
    };
    Red.prototype.convertFrom = function convertFrom(num2) {
      var res = num2.clone();
      res.red = null;
      return res;
    };
    BN.mont = function mont(num2) {
      return new Mont(num2);
    };
    function Mont(m) {
      Red.call(this, m);
      this.shift = this.m.bitLength();
      if (this.shift % 26 !== 0) {
        this.shift += 26 - this.shift % 26;
      }
      this.r = new BN(1).iushln(this.shift);
      this.r2 = this.imod(this.r.sqr());
      this.rinv = this.r._invmp(this.m);
      this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
      this.minv = this.minv.umod(this.r);
      this.minv = this.r.sub(this.minv);
    }
    inherits(Mont, Red);
    Mont.prototype.convertTo = function convertTo(num2) {
      return this.imod(num2.ushln(this.shift));
    };
    Mont.prototype.convertFrom = function convertFrom(num2) {
      var r = this.imod(num2.mul(this.rinv));
      r.red = null;
      return r;
    };
    Mont.prototype.imul = function imul(a, b) {
      if (a.isZero() || b.isZero()) {
        a.words[0] = 0;
        a.length = 1;
        return a;
      }
      var t = a.imul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;
      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }
      return res._forceRed(this);
    };
    Mont.prototype.mul = function mul(a, b) {
      if (a.isZero() || b.isZero())
        return new BN(0)._forceRed(this);
      var t = a.mul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;
      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }
      return res._forceRed(this);
    };
    Mont.prototype.invm = function invm(a) {
      var res = this.imod(a._invmp(this.m).mul(this.r2));
      return res._forceRed(this);
    };
  })(typeof module === "undefined" || module, exports);
});

// node_modules/js-sha3/src/sha3.js
var require_sha3 = __commonJS((exports, module) => {
  (function() {
    var INPUT_ERROR = "input is invalid type";
    var FINALIZE_ERROR = "finalize already called";
    var WINDOW = typeof window === "object";
    var root = WINDOW ? window : {};
    if (root.JS_SHA3_NO_WINDOW) {
      WINDOW = false;
    }
    var WEB_WORKER = !WINDOW && typeof self === "object";
    var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
    if (NODE_JS) {
      root = global;
    } else if (WEB_WORKER) {
      root = self;
    }
    var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === "object" && module.exports;
    var AMD = typeof define === "function" && define.amd;
    var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
    var HEX_CHARS = "0123456789abcdef".split("");
    var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
    var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
    var KECCAK_PADDING = [1, 256, 65536, 16777216];
    var PADDING = [6, 1536, 393216, 100663296];
    var SHIFT = [0, 8, 16, 24];
    var RC = [
      1,
      0,
      32898,
      0,
      32906,
      2147483648,
      2147516416,
      2147483648,
      32907,
      0,
      2147483649,
      0,
      2147516545,
      2147483648,
      32777,
      2147483648,
      138,
      0,
      136,
      0,
      2147516425,
      0,
      2147483658,
      0,
      2147516555,
      0,
      139,
      2147483648,
      32905,
      2147483648,
      32771,
      2147483648,
      32770,
      2147483648,
      128,
      2147483648,
      32778,
      0,
      2147483658,
      2147483648,
      2147516545,
      2147483648,
      32896,
      2147483648,
      2147483649,
      0,
      2147516424,
      2147483648
    ];
    var BITS = [224, 256, 384, 512];
    var SHAKE_BITS = [128, 256];
    var OUTPUT_TYPES = ["hex", "buffer", "arrayBuffer", "array", "digest"];
    var CSHAKE_BYTEPAD = {
      "128": 168,
      "256": 136
    };
    if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
      Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
      };
    }
    if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
      ArrayBuffer.isView = function(obj) {
        return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
      };
    }
    var createOutputMethod = function(bits2, padding, outputType) {
      return function(message) {
        return new Keccak2(bits2, padding, bits2).update(message)[outputType]();
      };
    };
    var createShakeOutputMethod = function(bits2, padding, outputType) {
      return function(message, outputBits) {
        return new Keccak2(bits2, padding, outputBits).update(message)[outputType]();
      };
    };
    var createCshakeOutputMethod = function(bits2, padding, outputType) {
      return function(message, outputBits, n, s) {
        return methods["cshake" + bits2].update(message, outputBits, n, s)[outputType]();
      };
    };
    var createKmacOutputMethod = function(bits2, padding, outputType) {
      return function(key, message, outputBits, s) {
        return methods["kmac" + bits2].update(key, message, outputBits, s)[outputType]();
      };
    };
    var createOutputMethods = function(method, createMethod2, bits2, padding) {
      for (var i2 = 0;i2 < OUTPUT_TYPES.length; ++i2) {
        var type = OUTPUT_TYPES[i2];
        method[type] = createMethod2(bits2, padding, type);
      }
      return method;
    };
    var createMethod = function(bits2, padding) {
      var method = createOutputMethod(bits2, padding, "hex");
      method.create = function() {
        return new Keccak2(bits2, padding, bits2);
      };
      method.update = function(message) {
        return method.create().update(message);
      };
      return createOutputMethods(method, createOutputMethod, bits2, padding);
    };
    var createShakeMethod = function(bits2, padding) {
      var method = createShakeOutputMethod(bits2, padding, "hex");
      method.create = function(outputBits) {
        return new Keccak2(bits2, padding, outputBits);
      };
      method.update = function(message, outputBits) {
        return method.create(outputBits).update(message);
      };
      return createOutputMethods(method, createShakeOutputMethod, bits2, padding);
    };
    var createCshakeMethod = function(bits2, padding) {
      var w = CSHAKE_BYTEPAD[bits2];
      var method = createCshakeOutputMethod(bits2, padding, "hex");
      method.create = function(outputBits, n, s) {
        if (!n && !s) {
          return methods["shake" + bits2].create(outputBits);
        } else {
          return new Keccak2(bits2, padding, outputBits).bytepad([n, s], w);
        }
      };
      method.update = function(message, outputBits, n, s) {
        return method.create(outputBits, n, s).update(message);
      };
      return createOutputMethods(method, createCshakeOutputMethod, bits2, padding);
    };
    var createKmacMethod = function(bits2, padding) {
      var w = CSHAKE_BYTEPAD[bits2];
      var method = createKmacOutputMethod(bits2, padding, "hex");
      method.create = function(key, outputBits, s) {
        return new Kmac(bits2, padding, outputBits).bytepad(["KMAC", s], w).bytepad([key], w);
      };
      method.update = function(key, message, outputBits, s) {
        return method.create(key, outputBits, s).update(message);
      };
      return createOutputMethods(method, createKmacOutputMethod, bits2, padding);
    };
    var algorithms = [
      { name: "keccak", padding: KECCAK_PADDING, bits: BITS, createMethod },
      { name: "sha3", padding: PADDING, bits: BITS, createMethod },
      { name: "shake", padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
      { name: "cshake", padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
      { name: "kmac", padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
    ];
    var methods = {}, methodNames = [];
    for (var i = 0;i < algorithms.length; ++i) {
      var algorithm = algorithms[i];
      var bits = algorithm.bits;
      for (var j = 0;j < bits.length; ++j) {
        var methodName = algorithm.name + "_" + bits[j];
        methodNames.push(methodName);
        methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
        if (algorithm.name !== "sha3") {
          var newMethodName = algorithm.name + bits[j];
          methodNames.push(newMethodName);
          methods[newMethodName] = methods[methodName];
        }
      }
    }
    function Keccak2(bits2, padding, outputBits) {
      this.blocks = [];
      this.s = [];
      this.padding = padding;
      this.outputBits = outputBits;
      this.reset = true;
      this.finalized = false;
      this.block = 0;
      this.start = 0;
      this.blockCount = 1600 - (bits2 << 1) >> 5;
      this.byteCount = this.blockCount << 2;
      this.outputBlocks = outputBits >> 5;
      this.extraBytes = (outputBits & 31) >> 3;
      for (var i2 = 0;i2 < 50; ++i2) {
        this.s[i2] = 0;
      }
    }
    Keccak2.prototype.update = function(message) {
      if (this.finalized) {
        throw new Error(FINALIZE_ERROR);
      }
      var notString, type = typeof message;
      if (type !== "string") {
        if (type === "object") {
          if (message === null) {
            throw new Error(INPUT_ERROR);
          } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          } else if (!Array.isArray(message)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
              throw new Error(INPUT_ERROR);
            }
          }
        } else {
          throw new Error(INPUT_ERROR);
        }
        notString = true;
      }
      var blocks = this.blocks, byteCount = this.byteCount, length = message.length, blockCount = this.blockCount, index2 = 0, s = this.s, i2, code;
      while (index2 < length) {
        if (this.reset) {
          this.reset = false;
          blocks[0] = this.block;
          for (i2 = 1;i2 < blockCount + 1; ++i2) {
            blocks[i2] = 0;
          }
        }
        if (notString) {
          for (i2 = this.start;index2 < length && i2 < byteCount; ++index2) {
            blocks[i2 >> 2] |= message[index2] << SHIFT[i2++ & 3];
          }
        } else {
          for (i2 = this.start;index2 < length && i2 < byteCount; ++index2) {
            code = message.charCodeAt(index2);
            if (code < 128) {
              blocks[i2 >> 2] |= code << SHIFT[i2++ & 3];
            } else if (code < 2048) {
              blocks[i2 >> 2] |= (192 | code >> 6) << SHIFT[i2++ & 3];
              blocks[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
            } else if (code < 55296 || code >= 57344) {
              blocks[i2 >> 2] |= (224 | code >> 12) << SHIFT[i2++ & 3];
              blocks[i2 >> 2] |= (128 | code >> 6 & 63) << SHIFT[i2++ & 3];
              blocks[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
            } else {
              code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index2) & 1023);
              blocks[i2 >> 2] |= (240 | code >> 18) << SHIFT[i2++ & 3];
              blocks[i2 >> 2] |= (128 | code >> 12 & 63) << SHIFT[i2++ & 3];
              blocks[i2 >> 2] |= (128 | code >> 6 & 63) << SHIFT[i2++ & 3];
              blocks[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
            }
          }
        }
        this.lastByteIndex = i2;
        if (i2 >= byteCount) {
          this.start = i2 - byteCount;
          this.block = blocks[blockCount];
          for (i2 = 0;i2 < blockCount; ++i2) {
            s[i2] ^= blocks[i2];
          }
          f(s);
          this.reset = true;
        } else {
          this.start = i2;
        }
      }
      return this;
    };
    Keccak2.prototype.encode = function(x, right) {
      var o = x & 255, n = 1;
      var bytes = [o];
      x = x >> 8;
      o = x & 255;
      while (o > 0) {
        bytes.unshift(o);
        x = x >> 8;
        o = x & 255;
        ++n;
      }
      if (right) {
        bytes.push(n);
      } else {
        bytes.unshift(n);
      }
      this.update(bytes);
      return bytes.length;
    };
    Keccak2.prototype.encodeString = function(str) {
      var notString, type = typeof str;
      if (type !== "string") {
        if (type === "object") {
          if (str === null) {
            throw new Error(INPUT_ERROR);
          } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
            str = new Uint8Array(str);
          } else if (!Array.isArray(str)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
              throw new Error(INPUT_ERROR);
            }
          }
        } else {
          throw new Error(INPUT_ERROR);
        }
        notString = true;
      }
      var bytes = 0, length = str.length;
      if (notString) {
        bytes = length;
      } else {
        for (var i2 = 0;i2 < str.length; ++i2) {
          var code = str.charCodeAt(i2);
          if (code < 128) {
            bytes += 1;
          } else if (code < 2048) {
            bytes += 2;
          } else if (code < 55296 || code >= 57344) {
            bytes += 3;
          } else {
            code = 65536 + ((code & 1023) << 10 | str.charCodeAt(++i2) & 1023);
            bytes += 4;
          }
        }
      }
      bytes += this.encode(bytes * 8);
      this.update(str);
      return bytes;
    };
    Keccak2.prototype.bytepad = function(strs, w) {
      var bytes = this.encode(w);
      for (var i2 = 0;i2 < strs.length; ++i2) {
        bytes += this.encodeString(strs[i2]);
      }
      var paddingBytes = w - bytes % w;
      var zeros = [];
      zeros.length = paddingBytes;
      this.update(zeros);
      return this;
    };
    Keccak2.prototype.finalize = function() {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      var blocks = this.blocks, i2 = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
      blocks[i2 >> 2] |= this.padding[i2 & 3];
      if (this.lastByteIndex === this.byteCount) {
        blocks[0] = blocks[blockCount];
        for (i2 = 1;i2 < blockCount + 1; ++i2) {
          blocks[i2] = 0;
        }
      }
      blocks[blockCount - 1] |= 2147483648;
      for (i2 = 0;i2 < blockCount; ++i2) {
        s[i2] ^= blocks[i2];
      }
      f(s);
    };
    Keccak2.prototype.toString = Keccak2.prototype.hex = function() {
      this.finalize();
      var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i2 = 0, j2 = 0;
      var hex = "", block;
      while (j2 < outputBlocks) {
        for (i2 = 0;i2 < blockCount && j2 < outputBlocks; ++i2, ++j2) {
          block = s[i2];
          hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15] + HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15] + HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15] + HEX_CHARS[block >> 28 & 15] + HEX_CHARS[block >> 24 & 15];
        }
        if (j2 % blockCount === 0) {
          f(s);
          i2 = 0;
        }
      }
      if (extraBytes) {
        block = s[i2];
        hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15];
        if (extraBytes > 1) {
          hex += HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15];
        }
        if (extraBytes > 2) {
          hex += HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15];
        }
      }
      return hex;
    };
    Keccak2.prototype.arrayBuffer = function() {
      this.finalize();
      var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i2 = 0, j2 = 0;
      var bytes = this.outputBits >> 3;
      var buffer2;
      if (extraBytes) {
        buffer2 = new ArrayBuffer(outputBlocks + 1 << 2);
      } else {
        buffer2 = new ArrayBuffer(bytes);
      }
      var array = new Uint32Array(buffer2);
      while (j2 < outputBlocks) {
        for (i2 = 0;i2 < blockCount && j2 < outputBlocks; ++i2, ++j2) {
          array[j2] = s[i2];
        }
        if (j2 % blockCount === 0) {
          f(s);
        }
      }
      if (extraBytes) {
        array[i2] = s[i2];
        buffer2 = buffer2.slice(0, bytes);
      }
      return buffer2;
    };
    Keccak2.prototype.buffer = Keccak2.prototype.arrayBuffer;
    Keccak2.prototype.digest = Keccak2.prototype.array = function() {
      this.finalize();
      var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i2 = 0, j2 = 0;
      var array = [], offset, block;
      while (j2 < outputBlocks) {
        for (i2 = 0;i2 < blockCount && j2 < outputBlocks; ++i2, ++j2) {
          offset = j2 << 2;
          block = s[i2];
          array[offset] = block & 255;
          array[offset + 1] = block >> 8 & 255;
          array[offset + 2] = block >> 16 & 255;
          array[offset + 3] = block >> 24 & 255;
        }
        if (j2 % blockCount === 0) {
          f(s);
        }
      }
      if (extraBytes) {
        offset = j2 << 2;
        block = s[i2];
        array[offset] = block & 255;
        if (extraBytes > 1) {
          array[offset + 1] = block >> 8 & 255;
        }
        if (extraBytes > 2) {
          array[offset + 2] = block >> 16 & 255;
        }
      }
      return array;
    };
    function Kmac(bits2, padding, outputBits) {
      Keccak2.call(this, bits2, padding, outputBits);
    }
    Kmac.prototype = new Keccak2;
    Kmac.prototype.finalize = function() {
      this.encode(this.outputBits, true);
      return Keccak2.prototype.finalize.call(this);
    };
    var f = function(s) {
      var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
      for (n = 0;n < 48; n += 2) {
        c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
        c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
        c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
        c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
        c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
        c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
        c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
        c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
        c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
        c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];
        h = c8 ^ (c2 << 1 | c3 >>> 31);
        l = c9 ^ (c3 << 1 | c2 >>> 31);
        s[0] ^= h;
        s[1] ^= l;
        s[10] ^= h;
        s[11] ^= l;
        s[20] ^= h;
        s[21] ^= l;
        s[30] ^= h;
        s[31] ^= l;
        s[40] ^= h;
        s[41] ^= l;
        h = c0 ^ (c4 << 1 | c5 >>> 31);
        l = c1 ^ (c5 << 1 | c4 >>> 31);
        s[2] ^= h;
        s[3] ^= l;
        s[12] ^= h;
        s[13] ^= l;
        s[22] ^= h;
        s[23] ^= l;
        s[32] ^= h;
        s[33] ^= l;
        s[42] ^= h;
        s[43] ^= l;
        h = c2 ^ (c6 << 1 | c7 >>> 31);
        l = c3 ^ (c7 << 1 | c6 >>> 31);
        s[4] ^= h;
        s[5] ^= l;
        s[14] ^= h;
        s[15] ^= l;
        s[24] ^= h;
        s[25] ^= l;
        s[34] ^= h;
        s[35] ^= l;
        s[44] ^= h;
        s[45] ^= l;
        h = c4 ^ (c8 << 1 | c9 >>> 31);
        l = c5 ^ (c9 << 1 | c8 >>> 31);
        s[6] ^= h;
        s[7] ^= l;
        s[16] ^= h;
        s[17] ^= l;
        s[26] ^= h;
        s[27] ^= l;
        s[36] ^= h;
        s[37] ^= l;
        s[46] ^= h;
        s[47] ^= l;
        h = c6 ^ (c0 << 1 | c1 >>> 31);
        l = c7 ^ (c1 << 1 | c0 >>> 31);
        s[8] ^= h;
        s[9] ^= l;
        s[18] ^= h;
        s[19] ^= l;
        s[28] ^= h;
        s[29] ^= l;
        s[38] ^= h;
        s[39] ^= l;
        s[48] ^= h;
        s[49] ^= l;
        b0 = s[0];
        b1 = s[1];
        b32 = s[11] << 4 | s[10] >>> 28;
        b33 = s[10] << 4 | s[11] >>> 28;
        b14 = s[20] << 3 | s[21] >>> 29;
        b15 = s[21] << 3 | s[20] >>> 29;
        b46 = s[31] << 9 | s[30] >>> 23;
        b47 = s[30] << 9 | s[31] >>> 23;
        b28 = s[40] << 18 | s[41] >>> 14;
        b29 = s[41] << 18 | s[40] >>> 14;
        b20 = s[2] << 1 | s[3] >>> 31;
        b21 = s[3] << 1 | s[2] >>> 31;
        b2 = s[13] << 12 | s[12] >>> 20;
        b3 = s[12] << 12 | s[13] >>> 20;
        b34 = s[22] << 10 | s[23] >>> 22;
        b35 = s[23] << 10 | s[22] >>> 22;
        b16 = s[33] << 13 | s[32] >>> 19;
        b17 = s[32] << 13 | s[33] >>> 19;
        b48 = s[42] << 2 | s[43] >>> 30;
        b49 = s[43] << 2 | s[42] >>> 30;
        b40 = s[5] << 30 | s[4] >>> 2;
        b41 = s[4] << 30 | s[5] >>> 2;
        b22 = s[14] << 6 | s[15] >>> 26;
        b23 = s[15] << 6 | s[14] >>> 26;
        b4 = s[25] << 11 | s[24] >>> 21;
        b5 = s[24] << 11 | s[25] >>> 21;
        b36 = s[34] << 15 | s[35] >>> 17;
        b37 = s[35] << 15 | s[34] >>> 17;
        b18 = s[45] << 29 | s[44] >>> 3;
        b19 = s[44] << 29 | s[45] >>> 3;
        b10 = s[6] << 28 | s[7] >>> 4;
        b11 = s[7] << 28 | s[6] >>> 4;
        b42 = s[17] << 23 | s[16] >>> 9;
        b43 = s[16] << 23 | s[17] >>> 9;
        b24 = s[26] << 25 | s[27] >>> 7;
        b25 = s[27] << 25 | s[26] >>> 7;
        b6 = s[36] << 21 | s[37] >>> 11;
        b7 = s[37] << 21 | s[36] >>> 11;
        b38 = s[47] << 24 | s[46] >>> 8;
        b39 = s[46] << 24 | s[47] >>> 8;
        b30 = s[8] << 27 | s[9] >>> 5;
        b31 = s[9] << 27 | s[8] >>> 5;
        b12 = s[18] << 20 | s[19] >>> 12;
        b13 = s[19] << 20 | s[18] >>> 12;
        b44 = s[29] << 7 | s[28] >>> 25;
        b45 = s[28] << 7 | s[29] >>> 25;
        b26 = s[38] << 8 | s[39] >>> 24;
        b27 = s[39] << 8 | s[38] >>> 24;
        b8 = s[48] << 14 | s[49] >>> 18;
        b9 = s[49] << 14 | s[48] >>> 18;
        s[0] = b0 ^ ~b2 & b4;
        s[1] = b1 ^ ~b3 & b5;
        s[10] = b10 ^ ~b12 & b14;
        s[11] = b11 ^ ~b13 & b15;
        s[20] = b20 ^ ~b22 & b24;
        s[21] = b21 ^ ~b23 & b25;
        s[30] = b30 ^ ~b32 & b34;
        s[31] = b31 ^ ~b33 & b35;
        s[40] = b40 ^ ~b42 & b44;
        s[41] = b41 ^ ~b43 & b45;
        s[2] = b2 ^ ~b4 & b6;
        s[3] = b3 ^ ~b5 & b7;
        s[12] = b12 ^ ~b14 & b16;
        s[13] = b13 ^ ~b15 & b17;
        s[22] = b22 ^ ~b24 & b26;
        s[23] = b23 ^ ~b25 & b27;
        s[32] = b32 ^ ~b34 & b36;
        s[33] = b33 ^ ~b35 & b37;
        s[42] = b42 ^ ~b44 & b46;
        s[43] = b43 ^ ~b45 & b47;
        s[4] = b4 ^ ~b6 & b8;
        s[5] = b5 ^ ~b7 & b9;
        s[14] = b14 ^ ~b16 & b18;
        s[15] = b15 ^ ~b17 & b19;
        s[24] = b24 ^ ~b26 & b28;
        s[25] = b25 ^ ~b27 & b29;
        s[34] = b34 ^ ~b36 & b38;
        s[35] = b35 ^ ~b37 & b39;
        s[44] = b44 ^ ~b46 & b48;
        s[45] = b45 ^ ~b47 & b49;
        s[6] = b6 ^ ~b8 & b0;
        s[7] = b7 ^ ~b9 & b1;
        s[16] = b16 ^ ~b18 & b10;
        s[17] = b17 ^ ~b19 & b11;
        s[26] = b26 ^ ~b28 & b20;
        s[27] = b27 ^ ~b29 & b21;
        s[36] = b36 ^ ~b38 & b30;
        s[37] = b37 ^ ~b39 & b31;
        s[46] = b46 ^ ~b48 & b40;
        s[47] = b47 ^ ~b49 & b41;
        s[8] = b8 ^ ~b0 & b2;
        s[9] = b9 ^ ~b1 & b3;
        s[18] = b18 ^ ~b10 & b12;
        s[19] = b19 ^ ~b11 & b13;
        s[28] = b28 ^ ~b20 & b22;
        s[29] = b29 ^ ~b21 & b23;
        s[38] = b38 ^ ~b30 & b32;
        s[39] = b39 ^ ~b31 & b33;
        s[48] = b48 ^ ~b40 & b42;
        s[49] = b49 ^ ~b41 & b43;
        s[0] ^= RC[n];
        s[1] ^= RC[n + 1];
      }
    };
    if (COMMON_JS) {
      module.exports = methods;
    } else {
      for (i = 0;i < methodNames.length; ++i) {
        root[methodNames[i]] = methods[methodNames[i]];
      }
      if (AMD) {
        define(function() {
          return methods;
        });
      }
    }
  })();
});

// src/index.ts
import { createServer } from "http";
import { WebSocketServer } from "ws";

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || undefined;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
};

// node_modules/hono/dist/utils/body.js
var isRawRequest = (request) => ("headers" in request);
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType = headers.get("Content-Type");
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) {
    return convertFormDataToBodyData(await request.bodyCache.formData, options);
  }
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== undefined) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1;i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1;j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (;i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? undefined : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? undefined : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? undefined : nextKeyIndex : valueIndex);
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? undefined : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== undefined) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? undefined;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw[key]();
  };
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers;
    if (value === undefined) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map;
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : undefined;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers;
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
  };
  json = (object, arg, headers) => {
    return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  redirect = (location, status) => {
    const locationString = String(location);
    this.header("Location", !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString));
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = undefined;
      try {
        executionContext = c.executionCtx;
      } catch {}
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== undefined ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(new Request(/^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`, requestInit), Env, executionCtx);
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, undefined, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = (method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  };
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== undefined) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some((k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node;
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some((k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node;
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node;
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0;; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1;i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1;j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== undefined) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== undefined) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(path === "*" ? "" : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)")}$`);
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie;
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map((route) => [!/\*|\/:/.test(route[0]), ...route]).sort(([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length);
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length;i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (;paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length;i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length;j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length;k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([handler, paramCount]));
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length;i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = undefined;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]]));
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/reg-exp-router/prepared-router.js
var PreparedRegExpRouter = class {
  name = "PreparedRegExpRouter";
  #matchers;
  #relocateMap;
  constructor(matchers, relocateMap) {
    this.#matchers = matchers;
    this.#relocateMap = relocateMap;
  }
  #addWildcard(method, handlerData) {
    const matcher = this.#matchers[method];
    matcher[1].forEach((list) => list && list.push(handlerData));
    Object.values(matcher[2]).forEach((list) => list[0].push(handlerData));
  }
  #addPath(method, path, handler, indexes, map) {
    const matcher = this.#matchers[method];
    if (!map) {
      matcher[2][path][0].push([handler, {}]);
    } else {
      indexes.forEach((index) => {
        if (typeof index === "number") {
          matcher[1][index].push([handler, map]);
        } else {
          matcher[2][index || path][0].push([handler, map]);
        }
      });
    }
  }
  add(method, path, handler) {
    if (!this.#matchers[method]) {
      const all = this.#matchers[METHOD_NAME_ALL];
      const staticMap = {};
      for (const key in all[2]) {
        staticMap[key] = [all[2][key][0].slice(), emptyParam];
      }
      this.#matchers[method] = [
        all[0],
        all[1].map((list) => Array.isArray(list) ? list.slice() : 0),
        staticMap
      ];
    }
    if (path === "/*" || path === "*") {
      const handlerData = [handler, {}];
      if (method === METHOD_NAME_ALL) {
        for (const m in this.#matchers) {
          this.#addWildcard(m, handlerData);
        }
      } else {
        this.#addWildcard(method, handlerData);
      }
      return;
    }
    const data = this.#relocateMap[path];
    if (!data) {
      throw new Error(`Path ${path} is not registered`);
    }
    for (const [indexes, map] of data) {
      if (method === METHOD_NAME_ALL) {
        for (const m in this.#matchers) {
          this.#addPath(m, path, handler, indexes, map);
        }
      } else {
        this.#addPath(method, path, handler, indexes, map);
      }
    }
  }
  buildAllMatchers() {
    return this.#matchers;
  }
  match = match;
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (;i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length;i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = undefined;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _ in children) {
    return true;
  }
  return false;
};
var Node2 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length;i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2;
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length;i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== undefined) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length;i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0;i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length;j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length;k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0;p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(handlerSets, child.#children["*"], method, node.#params, params);
              }
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(handlerSets, child.#children["*"], method, params, node.#params);
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2;
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length;i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter, new TrieRouter]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  };
};

// src/config.ts
var import_config = __toESM(require_config(), 1);
var config = {
  port: Number(process.env.PORT || 3000),
  flareRpcUrl: process.env.FLARE_RPC_URL || "https://rpc.ankr.com/flare",
  privateKey: process.env.PRIVATE_KEY
};
// node_modules/viem/_esm/utils/uid.js
var size = 256;
var index = size;
var buffer;
function uid(length = 11) {
  if (!buffer || index + length > size * 2) {
    buffer = "";
    index = 0;
    for (let i = 0;i < size; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}

// node_modules/viem/_esm/clients/createClient.js
function createClient(parameters) {
  const { batch, chain, ccipRead, dataSuffix, key = "base", name = "Base Client", tokens, type = "base" } = parameters;
  const experimental_blockTag = parameters.experimental_blockTag ?? (typeof chain?.experimental_preconfirmationTime === "number" ? "pending" : undefined);
  const blockTime = chain?.blockTime ?? 12000;
  const defaultPollingInterval = Math.min(Math.max(Math.floor(blockTime / 2), 500), 4000);
  const pollingInterval = parameters.pollingInterval ?? defaultPollingInterval;
  const cacheTime = parameters.cacheTime ?? pollingInterval;
  const account = parameters.account ? parseAccount(parameters.account) : undefined;
  const { config: config2, request, value } = parameters.transport({
    account,
    chain,
    pollingInterval
  });
  const transport = { ...config2, ...value };
  const client = {
    account,
    batch,
    cacheTime,
    ccipRead,
    chain,
    dataSuffix,
    key,
    name,
    pollingInterval,
    request,
    tokens,
    transport,
    type,
    uid: uid(),
    ...experimental_blockTag ? { experimental_blockTag } : {}
  };
  function extend(base) {
    return (extendFn) => {
      const extended = extendFn(base);
      for (const key2 in client)
        delete extended[key2];
      const combined = { ...base, ...extended };
      for (const key2 in extended) {
        const a = base[key2];
        const b = extended[key2];
        if (isPlainObject(a) && isPlainObject(b))
          combined[key2] = { ...a, ...b };
      }
      return Object.assign(combined, { extend: extend(combined) });
    };
  }
  return Object.assign(client, { extend: extend(client) });
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null)
    return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function bindActionDecorators(client, action) {
  const wrapped = (parameters = {}) => action(client, parameters);
  for (const key of [
    "call",
    "calls",
    "callWithPeriod",
    "estimateGas",
    "prepare",
    "prepareRecipient",
    "simulate"
  ])
    if (Object.hasOwn(action, key)) {
      const helper = action[key];
      wrapped[key] = (args = {}) => {
        if (helper.length === 1)
          return helper(args);
        return helper(client, args);
      };
    }
  for (const key of ["extractEvent", "extractEvents"])
    if (Object.hasOwn(action, key))
      wrapped[key] = action[key];
  return wrapped;
}

// node_modules/viem/_esm/actions/ens/getEnsAddress.js
init_abis();
init_decodeFunctionResult();
init_encodeFunctionData();
init_getAddress();
init_getChainContractAddress();
init_size();
init_toHex();

// node_modules/viem/_esm/utils/ens/errors.js
init_base();
init_contract();
function isNullUniversalResolverError(err) {
  if (!(err instanceof BaseError))
    return false;
  const cause = err.walk((e) => e instanceof ContractFunctionRevertedError);
  if (!(cause instanceof ContractFunctionRevertedError))
    return false;
  if (cause.data?.errorName === "HttpError")
    return true;
  if (cause.data?.errorName === "ResolverError")
    return true;
  if (cause.data?.errorName === "ResolverNotContract")
    return true;
  if (cause.data?.errorName === "ResolverNotFound")
    return true;
  if (cause.data?.errorName === "ReverseAddressMismatch")
    return true;
  if (cause.data?.errorName === "UnsupportedResolverProfile")
    return true;
  return false;
}

// node_modules/viem/_esm/actions/ens/getEnsAddress.js
init_localBatchGatewayRequest();

// node_modules/viem/_esm/utils/ens/namehash.js
init_toBytes();
init_toHex();
init_keccak256();

// node_modules/viem/_esm/utils/ens/encodedLabelToLabelhash.js
function encodedLabelToLabelhash(label) {
  if (label.length !== 66)
    return null;
  if (label.indexOf("[") !== 0)
    return null;
  if (label.indexOf("]") !== 65)
    return null;
  const hash2 = `0x${label.slice(1, 65)}`;
  if (!isHex(hash2))
    return null;
  return hash2;
}

// node_modules/viem/_esm/utils/ens/namehash.js
function namehash(name) {
  let result = new Uint8Array(32).fill(0);
  if (!name)
    return bytesToHex(result);
  const labels = name.split(".");
  for (let i = labels.length - 1;i >= 0; i -= 1) {
    const hashFromEncodedLabel = encodedLabelToLabelhash(labels[i]);
    const hashed = hashFromEncodedLabel ? toBytes(hashFromEncodedLabel) : keccak256(stringToBytes(labels[i]), "bytes");
    result = keccak256(concat([result, hashed]), "bytes");
  }
  return bytesToHex(result);
}

// node_modules/viem/_esm/utils/ens/packetToBytes.js
init_toBytes();

// node_modules/viem/_esm/utils/ens/encodeLabelhash.js
function encodeLabelhash(hash2) {
  return `[${hash2.slice(2)}]`;
}

// node_modules/viem/_esm/utils/ens/labelhash.js
init_toBytes();
init_toHex();
init_keccak256();
function labelhash(label) {
  const result = new Uint8Array(32).fill(0);
  if (!label)
    return bytesToHex(result);
  return encodedLabelToLabelhash(label) || keccak256(stringToBytes(label));
}

// node_modules/viem/_esm/utils/ens/packetToBytes.js
function packetToBytes(packet) {
  const value = packet.replace(/^\.|\.$/gm, "");
  if (value.length === 0)
    return new Uint8Array(1);
  const bytes = new Uint8Array(stringToBytes(value).byteLength + 2);
  let offset = 0;
  const list = value.split(".");
  for (let i = 0;i < list.length; i++) {
    let encoded = stringToBytes(list[i]);
    if (encoded.byteLength > 255)
      encoded = stringToBytes(encodeLabelhash(labelhash(list[i])));
    bytes[offset] = encoded.length;
    bytes.set(encoded, offset + 1);
    offset += encoded.length + 1;
  }
  if (bytes.byteLength !== offset + 1)
    return bytes.slice(0, offset + 1);
  return bytes;
}

// node_modules/viem/_esm/utils/getAction.js
function getAction(client, actionFn, name) {
  const action_implicit = client[actionFn.name];
  if (typeof action_implicit === "function")
    return action_implicit;
  const action_explicit = client[name];
  if (typeof action_explicit === "function")
    return action_explicit;
  return (params) => actionFn(client, params);
}

// node_modules/viem/_esm/actions/public/readContract.js
init_decodeFunctionResult();
init_encodeFunctionData();

// node_modules/viem/_esm/utils/errors/getContractError.js
init_abi();
init_base();
init_contract();
init_request();
init_rpc();
var EXECUTION_REVERTED_ERROR_CODE = 3;
function getContractError(err, { abi, address, args, docsPath: docsPath5, functionName, sender }) {
  const error = err instanceof RawContractError ? err : err instanceof BaseError ? err.walk((err2) => ("data" in err2)) || err.walk() : {};
  const { code, data, details, message, shortMessage } = error;
  const cause = (() => {
    if (err instanceof AbiDecodingZeroDataError)
      return new ContractFunctionZeroDataError({ functionName, cause: err });
    if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || details || message || shortMessage) || code === InvalidInputRpcError.code && details === "execution reverted" && data) {
      return new ContractFunctionRevertedError({
        abi,
        data: typeof data === "object" ? data.data : data,
        functionName,
        message: error instanceof RpcRequestError ? details : shortMessage ?? message,
        cause: err
      });
    }
    return err;
  })();
  return new ContractFunctionExecutionError(cause, {
    abi,
    args,
    contractAddress: address,
    docsPath: docsPath5,
    functionName,
    sender
  });
}

// node_modules/viem/_esm/actions/public/readContract.js
init_call();
async function readContract(client, parameters) {
  const { abi, address, args, functionName, ...rest } = parameters;
  const calldata = encodeFunctionData({
    abi,
    args,
    functionName
  });
  try {
    const { data } = await getAction(client, call, "call")({
      ...rest,
      data: calldata,
      to: address
    });
    return decodeFunctionResult({
      abi,
      args,
      functionName,
      data: data || "0x"
    });
  } catch (error) {
    throw getContractError(error, {
      abi,
      address,
      args,
      docsPath: "/docs/contract/readContract",
      functionName
    });
  }
}

// node_modules/viem/_esm/actions/ens/getEnsAddress.js
async function getEnsAddress(client, parameters) {
  const { blockNumber, blockTag, coinType, name, gatewayUrls, strict } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  const tlds = chain?.ensTlds;
  if (tlds && !tlds.some((tld) => name.endsWith(tld)))
    return null;
  const args = (() => {
    if (coinType != null)
      return [namehash(name), BigInt(coinType)];
    return [namehash(name)];
  })();
  try {
    const functionData = encodeFunctionData({
      abi: addressResolverAbi,
      functionName: "addr",
      args
    });
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      functionName: "resolveWithGateways",
      args: [
        toHex(packetToBytes(name)),
        functionData,
        gatewayUrls ?? [localBatchGatewayUrl]
      ],
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const address = decodeAddress2({ coinType, data: res[0], args });
    if (address === "0x")
      return null;
    if (trim(address) === "0x00")
      return null;
    return address;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err))
      return null;
    throw err;
  }
}
function decodeAddress2({ coinType, data, args }) {
  try {
    return decodeFunctionResult({
      abi: addressResolverAbi,
      args,
      functionName: "addr",
      data
    });
  } catch (err) {
    if (coinType == null)
      throw err;
    const address = trim(data);
    if (size2(address) === 20)
      return getAddress(address);
    throw err;
  }
}

// node_modules/viem/_esm/errors/ens.js
init_base();

class EnsAvatarInvalidMetadataError extends BaseError {
  constructor({ data }) {
    super("Unable to extract image from metadata. The metadata may be malformed or invalid.", {
      metaMessages: [
        "- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
        "",
        `Provided data: ${JSON.stringify(data)}`
      ],
      name: "EnsAvatarInvalidMetadataError"
    });
  }
}

class EnsAvatarInvalidNftUriError extends BaseError {
  constructor({ reason }) {
    super(`ENS NFT avatar URI is invalid. ${reason}`, {
      name: "EnsAvatarInvalidNftUriError"
    });
  }
}

class EnsAvatarUriResolutionError extends BaseError {
  constructor({ uri }) {
    super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: "EnsAvatarUriResolutionError" });
  }
}

class EnsAvatarUnsupportedNamespaceError extends BaseError {
  constructor({ namespace }) {
    super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`, { name: "EnsAvatarUnsupportedNamespaceError" });
  }
}

// node_modules/viem/_esm/utils/ens/avatar/utils.js
var networkRegex = /(?<protocol>https?:\/\/[^/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
var ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
var base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
var dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
async function isImageUri(uri) {
  try {
    const res = await fetch(uri, { method: "HEAD" });
    if (res.status === 200) {
      const contentType = res.headers.get("content-type");
      return contentType?.startsWith("image/");
    }
    return false;
  } catch (error) {
    if (typeof error === "object" && typeof error.response !== "undefined") {
      return false;
    }
    if (!Object.hasOwn(globalThis, "Image"))
      return false;
    return new Promise((resolve) => {
      const img = new Image;
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = uri;
    });
  }
}
function getGateway(custom, defaultGateway) {
  if (!custom)
    return defaultGateway;
  if (custom.endsWith("/"))
    return custom.slice(0, -1);
  return custom;
}
function resolveAvatarUri({ uri, gatewayUrls }) {
  const isEncoded = base64Regex.test(uri);
  if (isEncoded)
    return { uri, isOnChain: true, isEncoded };
  const ipfsGateway = getGateway(gatewayUrls?.ipfs, "https://ipfs.io");
  const arweaveGateway = getGateway(gatewayUrls?.arweave, "https://arweave.net");
  const networkRegexMatch = uri.match(networkRegex);
  const { protocol, subpath, target, subtarget = "" } = networkRegexMatch?.groups || {};
  const isIPNS = protocol === "ipns:/" || subpath === "ipns/";
  const isIPFS = protocol === "ipfs:/" || subpath === "ipfs/" || ipfsHashRegex.test(uri);
  if (uri.startsWith("http") && !isIPNS && !isIPFS) {
    let replacedUri = uri;
    if (gatewayUrls?.arweave)
      replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls?.arweave);
    return { uri: replacedUri, isOnChain: false, isEncoded: false };
  }
  if ((isIPNS || isIPFS) && target) {
    return {
      uri: `${ipfsGateway}/${isIPNS ? "ipns" : "ipfs"}/${target}${subtarget}`,
      isOnChain: false,
      isEncoded: false
    };
  }
  if (protocol === "ar:/" && target) {
    return {
      uri: `${arweaveGateway}/${target}${subtarget || ""}`,
      isOnChain: false,
      isEncoded: false
    };
  }
  let parsedUri = uri.replace(dataURIRegex, "");
  if (parsedUri.startsWith("<svg")) {
    parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
  }
  if (parsedUri.startsWith("data:") || parsedUri.startsWith("{")) {
    return {
      uri: parsedUri,
      isOnChain: true,
      isEncoded: false
    };
  }
  throw new EnsAvatarUriResolutionError({ uri });
}
function getJsonImage(data) {
  if (typeof data !== "object" || !("image" in data) && !("image_url" in data) && !("image_data" in data)) {
    throw new EnsAvatarInvalidMetadataError({ data });
  }
  return data.image || data.image_url || data.image_data;
}
async function getMetadataAvatarUri({ gatewayUrls, uri }) {
  try {
    const res = await fetch(uri).then((res2) => res2.json());
    const image = await parseAvatarUri({
      gatewayUrls,
      uri: getJsonImage(res)
    });
    return image;
  } catch {
    throw new EnsAvatarUriResolutionError({ uri });
  }
}
async function parseAvatarUri({ gatewayUrls, uri }) {
  const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
  if (isOnChain)
    return resolvedURI;
  const isImage = await isImageUri(resolvedURI);
  if (isImage)
    return resolvedURI;
  throw new EnsAvatarUriResolutionError({ uri });
}
function parseNftUri(uri_) {
  let uri = uri_;
  if (uri.startsWith("did:nft:")) {
    uri = uri.replace("did:nft:", "").replace(/_/g, "/");
  }
  const [reference, asset_namespace, tokenID] = uri.split("/");
  const [eip_namespace, chainID] = reference.split(":");
  const [erc_namespace, contractAddress] = asset_namespace.split(":");
  if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155")
    throw new EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
  if (!chainID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
  if (!contractAddress)
    throw new EnsAvatarInvalidNftUriError({
      reason: "Contract address not found"
    });
  if (!tokenID)
    throw new EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
  if (!erc_namespace)
    throw new EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
  return {
    chainID: Number.parseInt(chainID, 10),
    namespace: erc_namespace.toLowerCase(),
    contractAddress,
    tokenID
  };
}
async function getNftTokenUri(client, { nft }) {
  if (nft.namespace === "erc721") {
    return readContract(client, {
      address: nft.contractAddress,
      abi: [
        {
          name: "tokenURI",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "tokenURI",
      args: [BigInt(nft.tokenID)]
    });
  }
  if (nft.namespace === "erc1155") {
    return readContract(client, {
      address: nft.contractAddress,
      abi: [
        {
          name: "uri",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "_id", type: "uint256" }],
          outputs: [{ name: "", type: "string" }]
        }
      ],
      functionName: "uri",
      args: [BigInt(nft.tokenID)]
    });
  }
  throw new EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
}

// node_modules/viem/_esm/utils/ens/avatar/parseAvatarRecord.js
async function parseAvatarRecord(client, { gatewayUrls, record }) {
  if (/eip155:/i.test(record))
    return parseNftAvatarUri(client, { gatewayUrls, record });
  return parseAvatarUri({ uri: record, gatewayUrls });
}
async function parseNftAvatarUri(client, { gatewayUrls, record }) {
  const nft = parseNftUri(record);
  const nftUri = await getNftTokenUri(client, { nft });
  const { uri: resolvedNftUri, isOnChain, isEncoded } = resolveAvatarUri({ uri: nftUri, gatewayUrls });
  if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
    const encodedJson = isEncoded ? atob(resolvedNftUri.replace("data:application/json;base64,", "")) : resolvedNftUri;
    const decoded = JSON.parse(encodedJson);
    return parseAvatarUri({ uri: getJsonImage(decoded), gatewayUrls });
  }
  let uriTokenId = nft.tokenID;
  if (nft.namespace === "erc1155")
    uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
  return getMetadataAvatarUri({
    gatewayUrls,
    uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
  });
}

// node_modules/viem/_esm/actions/ens/getEnsText.js
init_abis();
init_decodeFunctionResult();
init_encodeFunctionData();
init_getChainContractAddress();
init_toHex();
init_localBatchGatewayRequest();
async function getEnsText(client, parameters) {
  const { blockNumber, blockTag, key, name, gatewayUrls, strict } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  const tlds = chain?.ensTlds;
  if (tlds && !tlds.some((tld) => name.endsWith(tld)))
    return null;
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverResolveAbi,
      args: [
        toHex(packetToBytes(name)),
        encodeFunctionData({
          abi: textResolverAbi,
          functionName: "text",
          args: [namehash(name), key]
        }),
        gatewayUrls ?? [localBatchGatewayUrl]
      ],
      functionName: "resolveWithGateways",
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const res = await readContractAction(readContractParameters);
    if (res[0] === "0x")
      return null;
    const record = decodeFunctionResult({
      abi: textResolverAbi,
      functionName: "text",
      data: res[0]
    });
    return record === "" ? null : record;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err))
      return null;
    throw err;
  }
}

// node_modules/viem/_esm/actions/ens/getEnsAvatar.js
async function getEnsAvatar(client, { blockNumber, blockTag, assetGatewayUrls, name, gatewayUrls, strict, universalResolverAddress }) {
  const record = await getAction(client, getEnsText, "getEnsText")({
    blockNumber,
    blockTag,
    key: "avatar",
    name,
    universalResolverAddress,
    gatewayUrls,
    strict
  });
  if (!record)
    return null;
  try {
    return await parseAvatarRecord(client, {
      record,
      gatewayUrls: assetGatewayUrls
    });
  } catch {
    return null;
  }
}

// node_modules/viem/_esm/actions/ens/getEnsName.js
init_abis();
init_getChainContractAddress();
init_localBatchGatewayRequest();
async function getEnsName(client, parameters) {
  const { address, blockNumber, blockTag, coinType = 60n, gatewayUrls, strict } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  try {
    const readContractParameters = {
      address: universalResolverAddress,
      abi: universalResolverReverseAbi,
      args: [address, coinType, gatewayUrls ?? [localBatchGatewayUrl]],
      functionName: "reverseWithGateways",
      blockNumber,
      blockTag
    };
    const readContractAction = getAction(client, readContract, "readContract");
    const [name] = await readContractAction(readContractParameters);
    return name || null;
  } catch (err) {
    if (strict)
      throw err;
    if (isNullUniversalResolverError(err))
      return null;
    throw err;
  }
}

// node_modules/viem/_esm/actions/ens/getEnsResolver.js
init_getChainContractAddress();
init_toHex();
async function getEnsResolver(client, parameters) {
  const { blockNumber, blockTag, name } = parameters;
  const { chain } = client;
  const universalResolverAddress = (() => {
    if (parameters.universalResolverAddress)
      return parameters.universalResolverAddress;
    if (!chain)
      throw new Error("client chain not configured. universalResolverAddress is required.");
    return getChainContractAddress({
      blockNumber,
      chain,
      contract: "ensUniversalResolver"
    });
  })();
  const tlds = chain?.ensTlds;
  if (tlds && !tlds.some((tld) => name.endsWith(tld)))
    throw new Error(`${name} is not a valid ENS TLD (${tlds?.join(", ")}) for chain "${chain.name}" (id: ${chain.id}).`);
  const [resolverAddress] = await getAction(client, readContract, "readContract")({
    address: universalResolverAddress,
    abi: [
      {
        inputs: [{ type: "bytes" }],
        name: "findResolver",
        outputs: [
          { type: "address" },
          { type: "bytes32" },
          { type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: "findResolver",
    args: [toHex(packetToBytes(name))],
    blockNumber,
    blockTag
  });
  return resolverAddress;
}

// node_modules/viem/_esm/clients/decorators/public.js
init_call();

// node_modules/viem/_esm/actions/public/createAccessList.js
init_base();
init_toHex();
init_getCallError();
init_transactionRequest();
init_assertRequest();
async function createAccessList(client, args) {
  const { account: account_ = client.account, blockNumber, blockTag = "latest", blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, to, value, ...rest } = args;
  const account = account_ ? parseAccount(account_) : undefined;
  try {
    assertRequest(args);
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : undefined;
    const block = blockNumberHex || blockTag;
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format2 = chainFormat || formatTransactionRequest;
    const request = format2({
      ...extract(rest, { format: chainFormat }),
      account,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      to,
      value
    }, "createAccessList");
    const response = await client.request({
      method: "eth_createAccessList",
      params: [request, block]
    });
    if (response.error)
      throw new BaseError(response.error, { details: response.error });
    return {
      accessList: response.accessList,
      gasUsed: BigInt(response.gasUsed)
    };
  } catch (err) {
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}

// node_modules/viem/_esm/utils/filters/createFilterRequestScope.js
function createFilterRequestScope(client, { method }) {
  const requestMap = {};
  if (client.transport.type === "fallback")
    client.transport.onResponse?.(({ method: method_, response: id, status, transport }) => {
      if (status === "success" && method === method_)
        requestMap[id] = transport.request;
    });
  return (id) => requestMap[id] || client.request;
}

// node_modules/viem/_esm/actions/public/createBlockFilter.js
async function createBlockFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newBlockFilter"
  });
  const id = await client.request({
    method: "eth_newBlockFilter"
  });
  return { id, request: getRequest(id), type: "block" };
}

// node_modules/viem/_esm/utils/abi/encodeEventTopics.js
init_abi();

// node_modules/viem/_esm/errors/log.js
init_base();

class FilterTypeNotSupportedError extends BaseError {
  constructor(type) {
    super(`Filter type "${type}" is not supported.`, {
      name: "FilterTypeNotSupportedError"
    });
  }
}

// node_modules/viem/_esm/utils/abi/encodeEventTopics.js
init_toBytes();
init_keccak256();
init_toEventSelector();
init_encodeAbiParameters();
init_formatAbiItem();
init_getAbiItem();
var docsPath6 = "/docs/contract/encodeEventTopics";
function encodeEventTopics(parameters) {
  const { abi, eventName, args } = parameters;
  let abiItem = abi[0];
  if (eventName) {
    const item = getAbiItem({ abi, name: eventName });
    if (!item)
      throw new AbiEventNotFoundError(eventName, { docsPath: docsPath6 });
    abiItem = item;
  }
  if (abiItem.type !== "event")
    throw new AbiEventNotFoundError(undefined, { docsPath: docsPath6 });
  let topics = [];
  if (args && "inputs" in abiItem) {
    const indexedInputs = abiItem.inputs?.filter((param) => ("indexed" in param) && param.indexed);
    const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? indexedInputs?.map((x) => args[x.name]) ?? [] : [];
    if (args_.length > 0) {
      topics = indexedInputs?.map((param, i) => {
        if (Array.isArray(args_[i]))
          return args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] }));
        return typeof args_[i] !== "undefined" && args_[i] !== null ? encodeArg({ param, value: args_[i] }) : null;
      }) ?? [];
    }
  }
  if (abiItem.anonymous)
    return topics;
  const definition = formatAbiItem(abiItem);
  const signature = toEventSelector(definition);
  return [signature, ...topics];
}
function encodeArg({ param, value }) {
  if (param.type === "string" || param.type === "bytes")
    return keccak256(toBytes(value));
  if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    throw new FilterTypeNotSupportedError(param.type);
  return encodeAbiParameters([param], [value]);
}

// node_modules/viem/_esm/actions/public/createContractEventFilter.js
init_toHex();
async function createContractEventFilter(client, parameters) {
  const { address, abi, args, eventName, fromBlock, strict, toBlock } = parameters;
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  const topics = eventName ? encodeEventTopics({
    abi,
    args,
    eventName
  }) : undefined;
  const id = await client.request({
    method: "eth_newFilter",
    params: [
      {
        address,
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
        topics
      }
    ]
  });
  return {
    abi,
    args,
    eventName,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    type: "event"
  };
}

// node_modules/viem/_esm/actions/public/createEventFilter.js
init_toHex();
async function createEventFilter(client, { address, args, event, events: events_, fromBlock, strict, toBlock } = {}) {
  const events = events_ ?? (event ? [event] : undefined);
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newFilter"
  });
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
      abi: [event2],
      eventName: event2.name,
      args
    }));
    topics = [encoded];
    if (event)
      topics = topics[0];
  }
  const id = await client.request({
    method: "eth_newFilter",
    params: [
      {
        address,
        fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
        ...topics.length ? { topics } : {}
      }
    ]
  });
  return {
    abi: events,
    args,
    eventName: event ? event.name : undefined,
    fromBlock,
    id,
    request: getRequest(id),
    strict: Boolean(strict),
    toBlock,
    type: "event"
  };
}

// node_modules/viem/_esm/actions/public/createPendingTransactionFilter.js
async function createPendingTransactionFilter(client) {
  const getRequest = createFilterRequestScope(client, {
    method: "eth_newPendingTransactionFilter"
  });
  const id = await client.request({
    method: "eth_newPendingTransactionFilter"
  });
  return { id, request: getRequest(id), type: "transaction" };
}

// node_modules/viem/_esm/actions/public/estimateContractGas.js
init_encodeFunctionData();

// node_modules/viem/_esm/actions/public/estimateGas.js
init_base();

// node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
init_getAddress();
init_keccak256();
function publicKeyToAddress(publicKey) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address}`);
}

// node_modules/viem/_esm/utils/signature/recoverPublicKey.js
init_size();
init_fromHex();
init_toHex();
async function recoverPublicKey({ hash: hash2, signature }) {
  const hashHex = isHex(hash2) ? hash2 : toHex(hash2);
  const { secp256k1: secp256k12 } = await Promise.resolve().then(() => (init_secp256k1(), exports_secp256k1));
  const signature_ = (() => {
    if (typeof signature === "object" && "r" in signature && "s" in signature) {
      const { r, s, v, yParity } = signature;
      const yParityOrV2 = Number(yParity ?? v);
      const recoveryBit2 = toRecoveryBit(yParityOrV2);
      return new secp256k12.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit2);
    }
    const signatureHex = isHex(signature) ? signature : toHex(signature);
    if (size2(signatureHex) !== 65)
      throw new Error("invalid signature length");
    const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
    const recoveryBit = toRecoveryBit(yParityOrV);
    return secp256k12.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
  })();
  const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
  return `0x${publicKey}`;
}
function toRecoveryBit(yParityOrV) {
  if (yParityOrV === 0 || yParityOrV === 1)
    return yParityOrV;
  if (yParityOrV === 27)
    return 0;
  if (yParityOrV === 28)
    return 1;
  throw new Error("Invalid yParityOrV value");
}

// node_modules/viem/_esm/utils/signature/recoverAddress.js
async function recoverAddress({ hash: hash2, signature }) {
  return publicKeyToAddress(await recoverPublicKey({ hash: hash2, signature }));
}

// node_modules/viem/_esm/utils/authorization/hashAuthorization.js
init_toBytes();
init_toHex();

// node_modules/viem/_esm/utils/encoding/toRlp.js
init_base();
init_cursor2();
init_toBytes();
init_toHex();
function toRlp(bytes, to = "hex") {
  const encodable = getEncodable(bytes);
  const cursor = createCursor(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (to === "hex")
    return bytesToHex(cursor.bytes);
  return cursor.bytes;
}
function getEncodable(bytes) {
  if (Array.isArray(bytes))
    return getEncodableList(bytes.map((x) => getEncodable(x)));
  return getEncodableBytes(bytes);
}
function getEncodableList(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(192 + bodyLength);
      } else {
        cursor.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor.pushUint24(bodyLength);
        else
          cursor.pushUint32(bodyLength);
      }
      for (const { encode } of list) {
        encode(cursor);
      }
    }
  };
}
function getEncodableBytes(bytesOrHex) {
  const bytes = typeof bytesOrHex === "string" ? hexToBytes(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 128)
      return 1;
    if (bytes.length <= 55)
      return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 128) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(128 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor.pushUint8(bytes.length);
        else if (sizeOfBytesLength === 2)
          cursor.pushUint16(bytes.length);
        else if (sizeOfBytesLength === 3)
          cursor.pushUint24(bytes.length);
        else
          cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength(length) {
  if (length < 2 ** 8)
    return 1;
  if (length < 2 ** 16)
    return 2;
  if (length < 2 ** 24)
    return 3;
  if (length < 2 ** 32)
    return 4;
  throw new BaseError("Length is too large.");
}

// node_modules/viem/_esm/utils/authorization/hashAuthorization.js
init_keccak256();
function hashAuthorization(parameters) {
  const { chainId, nonce, to } = parameters;
  const address = parameters.contractAddress ?? parameters.address;
  const hash2 = keccak256(concatHex([
    "0x05",
    toRlp([
      chainId ? numberToHex(chainId) : "0x",
      address,
      nonce ? numberToHex(nonce) : "0x"
    ])
  ]));
  if (to === "bytes")
    return hexToBytes(hash2);
  return hash2;
}

// node_modules/viem/_esm/utils/authorization/recoverAuthorizationAddress.js
async function recoverAuthorizationAddress(parameters) {
  const { authorization, signature } = parameters;
  return recoverAddress({
    hash: hashAuthorization(authorization),
    signature: signature ?? authorization
  });
}

// node_modules/viem/_esm/actions/public/estimateGas.js
init_toHex();

// node_modules/viem/_esm/errors/estimateGas.js
init_formatEther();
init_formatGwei();
init_base();
init_transaction();

class EstimateGasExecutionError extends BaseError {
  constructor(cause, { account, docsPath: docsPath7, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value }) {
    const prettyArgs = prettyPrint({
      from: account?.address,
      to,
      value: typeof value !== "undefined" && `${formatEther2(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
      data,
      gas,
      gasPrice: typeof gasPrice !== "undefined" && `${formatGwei2(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei2(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei2(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    super(cause.shortMessage, {
      cause,
      docsPath: docsPath7,
      metaMessages: [
        ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
        "Estimate Gas Arguments:",
        prettyArgs
      ].filter(Boolean),
      name: "EstimateGasExecutionError"
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.cause = cause;
  }
}

// node_modules/viem/_esm/utils/errors/getEstimateGasError.js
init_node();
init_getNodeError();
function getEstimateGasError(err, { docsPath: docsPath7, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new EstimateGasExecutionError(cause, {
    docsPath: docsPath7,
    ...args
  });
}

// node_modules/viem/_esm/actions/public/estimateGas.js
init_transactionRequest();
init_stateOverride2();
init_assertRequest();
// node_modules/viem/_esm/errors/fee.js
init_formatGwei();
init_base();

class BaseFeeScalarError extends BaseError {
  constructor() {
    super("`baseFeeMultiplier` must be greater than 1.", {
      name: "BaseFeeScalarError"
    });
  }
}

class Eip1559FeesNotSupportedError extends BaseError {
  constructor() {
    super("Chain does not support EIP-1559 fees.", {
      name: "Eip1559FeesNotSupportedError"
    });
  }
}

class MaxFeePerGasTooLowError extends BaseError {
  constructor({ maxPriorityFeePerGas }) {
    super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei2(maxPriorityFeePerGas)} gwei).`, { name: "MaxFeePerGasTooLowError" });
  }
}

// node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
init_fromHex();

// node_modules/viem/_esm/errors/block.js
init_base();

class BlockNotFoundError extends BaseError {
  constructor({ blockHash, blockNumber }) {
    let identifier = "Block";
    if (blockHash)
      identifier = `Block at hash "${blockHash}"`;
    if (blockNumber)
      identifier = `Block at number "${blockNumber}"`;
    super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
  }
}

// node_modules/viem/_esm/actions/public/getBlock.js
init_toHex();

// node_modules/viem/_esm/utils/formatters/transaction.js
init_fromHex();
var transactionType = {
  "0x0": "legacy",
  "0x1": "eip2930",
  "0x2": "eip1559",
  "0x3": "eip4844",
  "0x4": "eip7702"
};
function formatTransaction(transaction, _) {
  const transaction_ = {
    ...transaction,
    blockHash: transaction.blockHash ? transaction.blockHash : null,
    blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
    ...transaction.blockTimestamp != null && {
      blockTimestamp: BigInt(transaction.blockTimestamp)
    },
    chainId: transaction.chainId ? hexToNumber(transaction.chainId) : undefined,
    gas: transaction.gas ? BigInt(transaction.gas) : undefined,
    gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
    maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : undefined,
    maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : undefined,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : undefined,
    nonce: transaction.nonce ? hexToNumber(transaction.nonce) : undefined,
    to: transaction.to ? transaction.to : null,
    transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
    type: transaction.type ? transactionType[transaction.type] : undefined,
    typeHex: transaction.type ? transaction.type : undefined,
    value: transaction.value ? BigInt(transaction.value) : undefined,
    v: transaction.v ? BigInt(transaction.v) : undefined
  };
  if (transaction.authorizationList)
    transaction_.authorizationList = formatAuthorizationList2(transaction.authorizationList);
  transaction_.yParity = (() => {
    if (transaction.yParity)
      return Number(transaction.yParity);
    if (typeof transaction_.v === "bigint") {
      if (transaction_.v === 0n || transaction_.v === 27n)
        return 0;
      if (transaction_.v === 1n || transaction_.v === 28n)
        return 1;
      if (transaction_.v >= 35n)
        return transaction_.v % 2n === 0n ? 1 : 0;
    }
    return;
  })();
  if (transaction_.type === "legacy") {
    delete transaction_.accessList;
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
    delete transaction_.yParity;
  }
  if (transaction_.type === "eip2930") {
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
  }
  if (transaction_.type === "eip1559")
    delete transaction_.maxFeePerBlobGas;
  return transaction_;
}
function formatAuthorizationList2(authorizationList) {
  return authorizationList.map((authorization) => ({
    address: authorization.address,
    chainId: Number(authorization.chainId),
    nonce: Number(authorization.nonce),
    r: authorization.r,
    s: authorization.s,
    yParity: Number(authorization.yParity)
  }));
}

// node_modules/viem/_esm/utils/formatters/block.js
function formatBlock(block, _) {
  const transactions = (block.transactions ?? []).map((transaction) => {
    if (typeof transaction === "string")
      return transaction;
    return formatTransaction(transaction);
  });
  return {
    ...block,
    baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
    blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : undefined,
    difficulty: block.difficulty ? BigInt(block.difficulty) : undefined,
    excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : undefined,
    gasLimit: block.gasLimit ? BigInt(block.gasLimit) : undefined,
    gasUsed: block.gasUsed ? BigInt(block.gasUsed) : undefined,
    hash: block.hash ? block.hash : null,
    logsBloom: block.logsBloom ? block.logsBloom : null,
    nonce: block.nonce ? block.nonce : null,
    number: block.number ? BigInt(block.number) : null,
    size: block.size ? BigInt(block.size) : undefined,
    timestamp: block.timestamp ? BigInt(block.timestamp) : undefined,
    transactions,
    totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
  };
}

// node_modules/viem/_esm/actions/public/getBlock.js
async function getBlock(client, { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", includeTransactions: includeTransactions_ } = {}) {
  const includeTransactions = includeTransactions_ ?? false;
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  let block = null;
  if (blockHash) {
    block = await client.request({
      method: "eth_getBlockByHash",
      params: [blockHash, includeTransactions]
    }, { dedupe: true });
  } else {
    block = await client.request({
      method: "eth_getBlockByNumber",
      params: [blockNumberHex || blockTag, includeTransactions]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  if (!block)
    throw new BlockNotFoundError({ blockHash, blockNumber });
  const format2 = client.chain?.formatters?.block?.format || formatBlock;
  return format2(block, "getBlock");
}

// node_modules/viem/_esm/actions/public/getGasPrice.js
async function getGasPrice(client) {
  const gasPrice = await client.request({
    method: "eth_gasPrice"
  });
  return BigInt(gasPrice);
}

// node_modules/viem/_esm/actions/public/estimateMaxPriorityFeePerGas.js
async function estimateMaxPriorityFeePerGas(client, args) {
  return internal_estimateMaxPriorityFeePerGas(client, args);
}
async function internal_estimateMaxPriorityFeePerGas(client, args) {
  const { block: block_, chain = client.chain, request } = args || {};
  try {
    const maxPriorityFeePerGas = chain?.fees?.maxPriorityFeePerGas ?? chain?.fees?.defaultPriorityFee;
    if (typeof maxPriorityFeePerGas === "function") {
      const block = block_ || await getAction(client, getBlock, "getBlock")({});
      const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
        block,
        client,
        request
      });
      if (maxPriorityFeePerGas_ === null)
        throw new Error;
      return maxPriorityFeePerGas_;
    }
    if (typeof maxPriorityFeePerGas !== "undefined")
      return maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex = await client.request({
      method: "eth_maxPriorityFeePerGas"
    });
    return hexToBigInt(maxPriorityFeePerGasHex);
  } catch {
    const [block, gasPrice] = await Promise.all([
      block_ ? Promise.resolve(block_) : getAction(client, getBlock, "getBlock")({}),
      getAction(client, getGasPrice, "getGasPrice")({})
    ]);
    if (typeof block.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError;
    const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
    if (maxPriorityFeePerGas < 0n)
      return 0n;
    return maxPriorityFeePerGas;
  }
}

// node_modules/viem/_esm/actions/public/estimateFeesPerGas.js
async function estimateFeesPerGas(client, args) {
  return internal_estimateFeesPerGas(client, args);
}
async function internal_estimateFeesPerGas(client, args) {
  const { block: block_, chain = client.chain, request, type = "eip1559" } = args || {};
  const baseFeeMultiplier = await (async () => {
    if (typeof chain?.fees?.baseFeeMultiplier === "function")
      return chain.fees.baseFeeMultiplier({
        block: block_,
        client,
        request
      });
    return chain?.fees?.baseFeeMultiplier ?? 1.2;
  })();
  if (baseFeeMultiplier < 1)
    throw new BaseFeeScalarError;
  const decimals = baseFeeMultiplier.toString().split(".")[1]?.length ?? 0;
  const denominator = 10 ** decimals;
  const multiply = (base) => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
  const block = block_ ? block_ : await getAction(client, getBlock, "getBlock")({});
  if (typeof chain?.fees?.estimateFeesPerGas === "function") {
    const fees = await chain.fees.estimateFeesPerGas({
      block: block_,
      client,
      multiply,
      request,
      type
    });
    if (fees !== null)
      return fees;
  }
  if (type === "eip1559") {
    if (typeof block.baseFeePerGas !== "bigint")
      throw new Eip1559FeesNotSupportedError;
    const maxPriorityFeePerGas = typeof request?.maxPriorityFeePerGas === "bigint" ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
      block,
      chain,
      request
    });
    const baseFeePerGas = multiply(block.baseFeePerGas);
    const maxFeePerGas = request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
    return {
      maxFeePerGas,
      maxPriorityFeePerGas
    };
  }
  const gasPrice = request?.gasPrice ?? multiply(await getAction(client, getGasPrice, "getGasPrice")({}));
  return {
    gasPrice
  };
}

// node_modules/viem/_esm/actions/public/getTransactionCount.js
init_formatBlockParameter();
init_fromHex();
async function getTransactionCount(client, { address, blockHash, blockNumber, blockTag = "latest", requireCanonical }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const count = await client.request({
    method: "eth_getTransactionCount",
    params: [address, block]
  }, {
    dedupe: typeof blockNumber === "bigint" || blockHash !== undefined
  });
  return hexToNumber(count);
}

// node_modules/viem/_esm/utils/blob/blobsToCommitments.js
init_toBytes();
init_toHex();
function blobsToCommitments(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = [];
  for (const blob of blobs)
    commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return to === "bytes" ? commitments : commitments.map((x) => bytesToHex(x));
}

// node_modules/viem/_esm/utils/blob/blobsToProofs.js
init_toBytes();
init_toHex();
function blobsToProofs(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes(x)) : parameters.commitments;
  const proofs = [];
  for (let i = 0;i < blobs.length; i++) {
    const blob = blobs[i];
    const commitment = commitments[i];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return to === "bytes" ? proofs : proofs.map((x) => bytesToHex(x));
}

// node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
init_toHex();

// node_modules/@noble/hashes/esm/sha256.js
init_sha2();
var sha2563 = sha2562;

// node_modules/viem/_esm/utils/hash/sha256.js
init_toBytes();
init_toHex();
function sha2564(value, to_) {
  const to = to_ || "hex";
  const bytes = sha2563(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}

// node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
function commitmentToVersionedHash(parameters) {
  const { commitment, version: version4 = 1 } = parameters;
  const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
  const versionedHash = sha2564(commitment, "bytes");
  versionedHash.set([version4], 0);
  return to === "bytes" ? versionedHash : bytesToHex(versionedHash);
}

// node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
function commitmentsToVersionedHashes(parameters) {
  const { commitments, version: version4 } = parameters;
  const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version: version4
    }));
  }
  return hashes;
}

// node_modules/viem/_esm/constants/blob.js
var blobsPerTransaction = 6;
var bytesPerFieldElement = 32;
var fieldElementsPerBlob = 4096;
var bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - 1 - 1 * fieldElementsPerBlob * blobsPerTransaction;

// node_modules/viem/_esm/errors/blob.js
init_base();

class BlobSizeTooLargeError extends BaseError {
  constructor({ maxSize, size: size5 }) {
    super("Blob size is too large.", {
      metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size5} bytes`],
      name: "BlobSizeTooLargeError"
    });
  }
}

class EmptyBlobError extends BaseError {
  constructor() {
    super("Blob data must not be empty.", { name: "EmptyBlobError" });
  }
}

// node_modules/viem/_esm/utils/blob/toBlobs.js
init_cursor2();
init_size();
init_toBytes();
init_toHex();
function toBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
  const data = typeof parameters.data === "string" ? hexToBytes(parameters.data) : parameters.data;
  const size_ = size2(data);
  if (!size_)
    throw new EmptyBlobError;
  if (size_ > maxBytesPerTransaction)
    throw new BlobSizeTooLargeError({
      maxSize: maxBytesPerTransaction,
      size: size_
    });
  const blobs = [];
  let active = true;
  let position = 0;
  while (active) {
    const blob = createCursor(new Uint8Array(bytesPerBlob));
    let size5 = 0;
    while (size5 < fieldElementsPerBlob) {
      const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
      blob.pushByte(0);
      blob.pushBytes(bytes);
      if (bytes.length < 31) {
        blob.pushByte(128);
        active = false;
        break;
      }
      size5++;
      position += 31;
    }
    blobs.push(blob);
  }
  return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex(x.bytes));
}

// node_modules/viem/_esm/utils/blob/toBlobSidecars.js
function toBlobSidecars(parameters) {
  const { data, kzg, to } = parameters;
  const blobs = parameters.blobs ?? toBlobs({ data, to });
  const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg, to });
  const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg, to });
  const sidecars = [];
  for (let i = 0;i < blobs.length; i++)
    sidecars.push({
      blob: blobs[i],
      commitment: commitments[i],
      proof: proofs[i]
    });
  return sidecars;
}

// node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
init_lru();
init_assertRequest();

// node_modules/viem/_esm/utils/transaction/getTransactionType.js
init_transaction();
function getTransactionType(transaction) {
  if (transaction.type)
    return transaction.type;
  if (typeof transaction.authorizationList !== "undefined")
    return "eip7702";
  if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined")
    return "eip4844";
  if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") {
    return "eip1559";
  }
  if (typeof transaction.gasPrice !== "undefined") {
    if (typeof transaction.accessList !== "undefined")
      return "eip2930";
    return "legacy";
  }
  throw new InvalidSerializableTransactionError({ transaction });
}
// node_modules/viem/_esm/utils/errors/getTransactionError.js
init_node();
init_transaction();
init_getNodeError();
function getTransactionError(err, { docsPath: docsPath7, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new TransactionExecutionError(cause, {
    docsPath: docsPath7,
    ...args
  });
}
// node_modules/viem/_esm/actions/public/fillTransaction.js
init_transactionRequest();
init_assertRequest();

// node_modules/viem/_esm/actions/public/getChainId.js
init_fromHex();
async function getChainId(client) {
  const chainIdHex = await client.request({
    method: "eth_chainId"
  }, { dedupe: true });
  return hexToNumber(chainIdHex);
}

// node_modules/viem/_esm/actions/public/fillTransaction.js
async function fillTransaction(client, parameters) {
  const { account = client.account, accessList, authorizationList, chain = client.chain, blobVersionedHashes, blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce: nonce_, nonceManager, to, type, value, ...rest } = parameters;
  const nonce = await (async () => {
    if (!account)
      return nonce_;
    if (!nonceManager)
      return nonce_;
    if (typeof nonce_ !== "undefined")
      return nonce_;
    const account_ = parseAccount(account);
    const chainId = chain ? chain.id : await getAction(client, getChainId, "getChainId")({});
    return await nonceManager.consume({
      address: account_.address,
      chainId,
      client
    });
  })();
  assertRequest(parameters);
  const chainFormat = chain?.formatters?.transactionRequest?.format;
  const format2 = chainFormat || formatTransactionRequest;
  const request = format2({
    ...extract(rest, { format: chainFormat }),
    account: account ? parseAccount(account) : undefined,
    accessList,
    authorizationList,
    blobs,
    blobVersionedHashes,
    data,
    gas,
    gasPrice,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    type,
    value
  }, "fillTransaction");
  try {
    const response = await client.request({
      method: "eth_fillTransaction",
      params: [request]
    });
    const format3 = chain?.formatters?.transaction?.format || formatTransaction;
    const transaction = format3(response.tx);
    delete transaction.blockHash;
    delete transaction.blockNumber;
    delete transaction.r;
    delete transaction.s;
    delete transaction.transactionIndex;
    delete transaction.v;
    delete transaction.yParity;
    transaction.data = transaction.input;
    if (transaction.gas)
      transaction.gas = parameters.gas ?? transaction.gas;
    if (transaction.gasPrice)
      transaction.gasPrice = parameters.gasPrice ?? transaction.gasPrice;
    if (transaction.maxFeePerBlobGas)
      transaction.maxFeePerBlobGas = parameters.maxFeePerBlobGas ?? transaction.maxFeePerBlobGas;
    if (transaction.maxFeePerGas)
      transaction.maxFeePerGas = parameters.maxFeePerGas ?? transaction.maxFeePerGas;
    if (transaction.maxPriorityFeePerGas)
      transaction.maxPriorityFeePerGas = parameters.maxPriorityFeePerGas ?? transaction.maxPriorityFeePerGas;
    if (typeof transaction.nonce !== "undefined")
      transaction.nonce = parameters.nonce ?? transaction.nonce;
    const feeMultiplier = await (async () => {
      if (typeof chain?.fees?.baseFeeMultiplier === "function") {
        const block = await getAction(client, getBlock, "getBlock")({});
        return chain.fees.baseFeeMultiplier({
          block,
          client,
          request: parameters
        });
      }
      return chain?.fees?.baseFeeMultiplier ?? 1.2;
    })();
    if (feeMultiplier < 1)
      throw new BaseFeeScalarError;
    const decimals = feeMultiplier.toString().split(".")[1]?.length ?? 0;
    const denominator = 10 ** decimals;
    const multiplyFee = (base) => base * BigInt(Math.ceil(feeMultiplier * denominator)) / BigInt(denominator);
    if (!transaction.feePayerSignature) {
      if (transaction.maxFeePerGas && !parameters.maxFeePerGas)
        transaction.maxFeePerGas = multiplyFee(transaction.maxFeePerGas);
      if (transaction.gasPrice && !parameters.gasPrice)
        transaction.gasPrice = multiplyFee(transaction.gasPrice);
    }
    return {
      raw: response.raw,
      transaction: {
        from: request.from,
        ...transaction
      },
      ...response.capabilities ? { capabilities: response.capabilities } : {}
    };
  } catch (err) {
    throw getTransactionError(err, {
      ...parameters,
      chain: client.chain
    });
  }
}

// node_modules/viem/_esm/actions/wallet/prepareTransactionRequest.js
var defaultParameters = [
  "blobVersionedHashes",
  "chainId",
  "fees",
  "gas",
  "nonce",
  "type"
];
var eip1559NetworkCache = /* @__PURE__ */ new Map;
var supportsFillTransaction = /* @__PURE__ */ new LruMap(128);
async function prepareTransactionRequest(client, args) {
  let request = args;
  request.account ??= client.account;
  request.parameters ??= defaultParameters;
  const { account: account_, chain = client.chain, nonceManager, parameters } = request;
  const prepareTransactionRequest2 = (() => {
    if (typeof chain?.prepareTransactionRequest === "function")
      return {
        fn: chain.prepareTransactionRequest,
        runAt: ["beforeFillTransaction"]
      };
    if (Array.isArray(chain?.prepareTransactionRequest))
      return {
        fn: chain.prepareTransactionRequest[0],
        runAt: chain.prepareTransactionRequest[1].runAt
      };
    return;
  })();
  let chainId;
  async function getChainId2() {
    if (chainId)
      return chainId;
    if (typeof request.chainId !== "undefined")
      return request.chainId;
    if (chain)
      return chain.id;
    const chainId_ = await getAction(client, getChainId, "getChainId")({});
    chainId = chainId_;
    return chainId;
  }
  const account = account_ ? parseAccount(account_) : account_;
  let nonce = request.nonce;
  if (parameters.includes("nonce") && typeof nonce === "undefined" && account && nonceManager) {
    const chainId2 = await getChainId2();
    nonce = await nonceManager.consume({
      address: account.address,
      chainId: chainId2,
      client
    });
  }
  if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("beforeFillTransaction")) {
    request = await prepareTransactionRequest2.fn({ ...request, chain }, {
      client,
      phase: "beforeFillTransaction"
    });
    nonce ??= request.nonce;
  }
  const attemptFill = (() => {
    if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && request.kzg && request.blobs)
      return false;
    if (supportsFillTransaction.get(client.uid) === false)
      return false;
    const shouldAttempt = ["fees", "gas"].some((parameter) => parameters.includes(parameter));
    if (!shouldAttempt)
      return false;
    if (parameters.includes("chainId") && typeof request.chainId !== "number")
      return true;
    if (parameters.includes("nonce") && typeof nonce !== "number")
      return true;
    if (parameters.includes("fees") && typeof request.gasPrice !== "bigint" && (typeof request.maxFeePerGas !== "bigint" || typeof request.maxPriorityFeePerGas !== "bigint"))
      return true;
    if (parameters.includes("gas") && typeof request.gas !== "bigint")
      return true;
    return false;
  })();
  const fillResult = attemptFill ? await getAction(client, fillTransaction, "fillTransaction")({ ...request, nonce }).then((result) => {
    const { chainId: chainId2, from: from3, gas: gas2, gasPrice, nonce: nonce2, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, type: type2, ...rest } = result.transaction;
    const feeToken = "feeToken" in rest ? rest.feeToken : undefined;
    const hasFilledFeePayerSignature = "feePayerSignature" in rest && rest.feePayerSignature !== null && typeof rest.feePayerSignature !== "undefined";
    const shouldUseFilledFeeToken = typeof feeToken !== "undefined" && feeToken !== null && (!("feeToken" in request) || hasFilledFeePayerSignature);
    supportsFillTransaction.set(client.uid, true);
    return {
      ...request,
      ...from3 ? { from: from3 } : {},
      ...type2 && !request.type ? { type: type2 } : {},
      ...typeof chainId2 !== "undefined" ? { chainId: chainId2 } : {},
      ...typeof gas2 !== "undefined" ? { gas: gas2 } : {},
      ...typeof gasPrice !== "undefined" ? { gasPrice } : {},
      ...typeof nonce2 !== "undefined" ? { nonce: nonce2 } : {},
      ...typeof maxFeePerBlobGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxFeePerBlobGas } : {},
      ...typeof maxFeePerGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxFeePerGas } : {},
      ...typeof maxPriorityFeePerGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxPriorityFeePerGas } : {},
      ..."nonceKey" in rest && typeof rest.nonceKey !== "undefined" ? { nonceKey: rest.nonceKey } : {},
      ..."keyAuthorization" in rest && typeof rest.keyAuthorization !== "undefined" && rest.keyAuthorization !== null && !("keyAuthorization" in request) ? { keyAuthorization: rest.keyAuthorization } : {},
      ..."feePayerSignature" in rest && typeof rest.feePayerSignature !== "undefined" && rest.feePayerSignature !== null ? { feePayerSignature: rest.feePayerSignature } : {},
      ...shouldUseFilledFeeToken ? { feeToken } : {},
      ...result.capabilities ? { _capabilities: result.capabilities } : {}
    };
  }).catch((e) => {
    const error = e;
    if (error.name !== "TransactionExecutionError")
      return request;
    const executionReverted = error.walk?.((e2) => {
      const error2 = e2;
      return error2.name === "ExecutionRevertedError";
    });
    if (executionReverted)
      throw e;
    const unsupported = error.walk?.((e2) => {
      const error2 = e2;
      return error2.name === "MethodNotFoundRpcError" || error2.name === "MethodNotSupportedRpcError" || error2.message?.includes("eth_fillTransaction is not available");
    });
    if (unsupported)
      supportsFillTransaction.set(client.uid, false);
    return request;
  }) : request;
  nonce ??= fillResult.nonce;
  request = {
    ...fillResult,
    ...account ? { from: account?.address } : {},
    ...typeof nonce !== "undefined" ? { nonce } : {}
  };
  const { blobs, gas, kzg, type } = request;
  if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("beforeFillParameters")) {
    request = await prepareTransactionRequest2.fn({ ...request, chain }, {
      client,
      phase: "beforeFillParameters"
    });
  }
  let block;
  async function getBlock2() {
    if (block)
      return block;
    block = await getAction(client, getBlock, "getBlock")({ blockTag: "latest" });
    return block;
  }
  if (parameters.includes("nonce") && typeof nonce === "undefined" && account && !nonceManager)
    request.nonce = await getAction(client, getTransactionCount, "getTransactionCount")({
      address: account.address,
      blockTag: "pending"
    });
  if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
    const commitments = blobsToCommitments({ blobs, kzg });
    if (parameters.includes("blobVersionedHashes")) {
      const versionedHashes = commitmentsToVersionedHashes({
        commitments,
        to: "hex"
      });
      request.blobVersionedHashes = versionedHashes;
    }
    if (parameters.includes("sidecars")) {
      const proofs = blobsToProofs({ blobs, commitments, kzg });
      const sidecars = toBlobSidecars({
        blobs,
        commitments,
        proofs,
        to: "hex"
      });
      request.sidecars = sidecars;
    }
  }
  if (parameters.includes("chainId"))
    request.chainId = await getChainId2();
  if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") {
    try {
      request.type = getTransactionType(request);
    } catch {
      let isEip1559Network = eip1559NetworkCache.get(client.uid);
      if (typeof isEip1559Network === "undefined") {
        const block2 = await getBlock2();
        isEip1559Network = typeof block2?.baseFeePerGas === "bigint";
        eip1559NetworkCache.set(client.uid, isEip1559Network);
      }
      request.type = isEip1559Network ? "eip1559" : "legacy";
    }
  }
  if (parameters.includes("fees")) {
    if (request.type !== "legacy" && request.type !== "eip2930") {
      if (typeof request.maxFeePerGas === "undefined" || typeof request.maxPriorityFeePerGas === "undefined") {
        const block2 = await getBlock2();
        const { maxFeePerGas, maxPriorityFeePerGas } = await internal_estimateFeesPerGas(client, {
          block: block2,
          chain,
          request
        });
        if (typeof request.maxPriorityFeePerGas === "undefined" && request.maxFeePerGas && request.maxFeePerGas < maxPriorityFeePerGas)
          throw new MaxFeePerGasTooLowError({
            maxPriorityFeePerGas
          });
        request.maxPriorityFeePerGas = maxPriorityFeePerGas;
        request.maxFeePerGas = maxFeePerGas;
      }
    } else {
      if (typeof request.maxFeePerGas !== "undefined" || typeof request.maxPriorityFeePerGas !== "undefined")
        throw new Eip1559FeesNotSupportedError;
      if (typeof request.gasPrice === "undefined") {
        const block2 = await getBlock2();
        const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(client, {
          block: block2,
          chain,
          request,
          type: "legacy"
        });
        request.gasPrice = gasPrice_;
      }
    }
  }
  if (parameters.includes("gas") && typeof gas === "undefined")
    request.gas = await getAction(client, estimateGas, "estimateGas")({
      ...request,
      account,
      prepare: account?.type === "local" ? [] : ["blobVersionedHashes"]
    });
  if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("afterFillParameters"))
    request = await prepareTransactionRequest2.fn({ ...request, chain }, {
      client,
      phase: "afterFillParameters"
    });
  assertRequest(request);
  delete request.parameters;
  return request;
}

// node_modules/viem/_esm/actions/public/estimateGas.js
async function estimateGas(client, args) {
  const { account: account_ = client.account, prepare = true } = args;
  const account = account_ ? parseAccount(account_) : undefined;
  const parameters = (() => {
    if (Array.isArray(prepare))
      return prepare;
    if (account?.type !== "local")
      return ["blobVersionedHashes"];
    return;
  })();
  try {
    const to = await (async () => {
      if (args.to)
        return args.to;
      if (args.authorizationList && args.authorizationList.length > 0)
        return await recoverAuthorizationAddress({
          authorization: args.authorizationList[0]
        }).catch(() => {
          throw new BaseError("`to` is required. Could not infer from `authorizationList`");
        });
      return;
    })();
    const { accessList, authorizationList, blobs, blobVersionedHashes, blockNumber, blockTag, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, value, stateOverride, ...rest } = prepare ? await prepareTransactionRequest(client, {
      ...args,
      parameters,
      to
    }) : args;
    if (gas && args.gas !== gas)
      return gas;
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : undefined;
    const block = blockNumberHex || blockTag;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    assertRequest(args);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format2 = chainFormat || formatTransactionRequest;
    const request = format2({
      ...extract(rest, { format: chainFormat }),
      account,
      accessList,
      authorizationList,
      blobs,
      blobVersionedHashes,
      data,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value
    }, "estimateGas");
    return BigInt(await client.request({
      method: "eth_estimateGas",
      params: rpcStateOverride ? [
        request,
        block ?? client.experimental_blockTag ?? "latest",
        rpcStateOverride
      ] : block ? [request, block] : [request]
    }));
  } catch (err) {
    throw getEstimateGasError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}

// node_modules/viem/_esm/actions/public/estimateContractGas.js
async function estimateContractGas(client, parameters) {
  const { abi, address, args, functionName, dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : client.dataSuffix?.value, ...request } = parameters;
  const data = encodeFunctionData({
    abi,
    args,
    functionName
  });
  try {
    const gas = await getAction(client, estimateGas, "estimateGas")({
      data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      ...request
    });
    return gas;
  } catch (error) {
    const account = request.account ? parseAccount(request.account) : undefined;
    throw getContractError(error, {
      abi,
      address,
      args,
      docsPath: "/docs/contract/estimateContractGas",
      functionName,
      sender: account?.address
    });
  }
}

// node_modules/viem/_esm/actions/public/getBalance.js
init_abis();
init_decodeFunctionResult();
init_encodeFunctionData();
init_formatBlockParameter();
init_call();
async function getBalance(client, { address, blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", requireCanonical }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  if (client.batch?.multicall && client.chain?.contracts?.multicall3) {
    const multicall3Address = client.chain.contracts.multicall3.address;
    const calldata = encodeFunctionData({
      abi: multicall3Abi,
      functionName: "getEthBalance",
      args: [address]
    });
    const { data } = await getAction(client, call, "call")({
      to: multicall3Address,
      data: calldata,
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    return decodeFunctionResult({
      abi: multicall3Abi,
      functionName: "getEthBalance",
      args: [address],
      data: data || "0x"
    });
  }
  const balance = await client.request({
    method: "eth_getBalance",
    params: [address, block]
  });
  return BigInt(balance);
}

// node_modules/viem/_esm/actions/public/getBlobBaseFee.js
async function getBlobBaseFee(client) {
  const baseFee = await client.request({
    method: "eth_blobBaseFee"
  });
  return BigInt(baseFee);
}

// node_modules/viem/_esm/utils/promise/withCache.js
var promiseCache = /* @__PURE__ */ new Map;
var responseCache = /* @__PURE__ */ new Map;
function getCache(cacheKey) {
  const buildCache = (cacheKey2, cache) => ({
    clear: () => cache.delete(cacheKey2),
    get: () => cache.get(cacheKey2),
    set: (data) => cache.set(cacheKey2, data)
  });
  const promise = buildCache(cacheKey, promiseCache);
  const response = buildCache(cacheKey, responseCache);
  return {
    clear: () => {
      promise.clear();
      response.clear();
    },
    promise,
    response
  };
}
async function withCache(fn, { cacheKey, cacheTime = Number.POSITIVE_INFINITY }) {
  const cache = getCache(cacheKey);
  const response = cache.response.get();
  if (response && cacheTime > 0) {
    const age = Date.now() - response.created.getTime();
    if (age < cacheTime)
      return response.data;
  }
  let promise = cache.promise.get();
  if (!promise) {
    promise = fn();
    cache.promise.set(promise);
  }
  try {
    const data = await promise;
    cache.response.set({ created: new Date, data });
    return data;
  } finally {
    cache.promise.clear();
  }
}

// node_modules/viem/_esm/actions/public/getBlockNumber.js
var cacheKey = (id) => `blockNumber.${id}`;
async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
  const blockNumberHex = await withCache(() => client.request({
    method: "eth_blockNumber"
  }), { cacheKey: cacheKey(client.uid), cacheTime });
  return BigInt(blockNumberHex);
}

// node_modules/viem/_esm/actions/public/getBlockReceipts.js
init_toHex();

// node_modules/viem/_esm/utils/formatters/transactionReceipt.js
init_fromHex();

// node_modules/viem/_esm/utils/formatters/log.js
function formatLog(log, { args, eventName } = {}) {
  return {
    ...log,
    blockHash: log.blockHash ? log.blockHash : null,
    blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
    blockTimestamp: log.blockTimestamp ? BigInt(log.blockTimestamp) : log.blockTimestamp === null ? null : undefined,
    logIndex: log.logIndex ? Number(log.logIndex) : null,
    transactionHash: log.transactionHash ? log.transactionHash : null,
    transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
    ...eventName ? { args, eventName } : {}
  };
}

// node_modules/viem/_esm/utils/formatters/transactionReceipt.js
var receiptStatuses = {
  "0x0": "reverted",
  "0x1": "success"
};
function formatTransactionReceipt(transactionReceipt, _) {
  const receipt = {
    ...transactionReceipt,
    blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
    contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
    cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
    effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
    gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
    logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => formatLog(log)) : null,
    to: transactionReceipt.to ? transactionReceipt.to : null,
    transactionIndex: transactionReceipt.transactionIndex ? hexToNumber(transactionReceipt.transactionIndex) : null,
    status: transactionReceipt.status ? receiptStatuses[transactionReceipt.status] : null,
    type: transactionReceipt.type ? transactionType[transactionReceipt.type] || transactionReceipt.type : null
  };
  if (transactionReceipt.blobGasPrice)
    receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
  if (transactionReceipt.blobGasUsed)
    receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
  return receipt;
}

// node_modules/viem/_esm/actions/public/getBlockReceipts.js
async function getBlockReceipts(client, { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest" } = {}) {
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  const receipts = await client.request({
    method: "eth_getBlockReceipts",
    params: [blockHash || blockNumberHex || blockTag]
  }, { dedupe: Boolean(blockHash || blockNumberHex) });
  if (!receipts)
    throw new BlockNotFoundError({ blockHash, blockNumber });
  const format2 = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
  return receipts.map((receipt) => format2(receipt, "getBlockReceipts"));
}

// node_modules/viem/_esm/actions/public/getBlockTransactionCount.js
init_fromHex();
init_toHex();
async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = "latest" } = {}) {
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  let count;
  if (blockHash) {
    count = await client.request({
      method: "eth_getBlockTransactionCountByHash",
      params: [blockHash]
    }, { dedupe: true });
  } else {
    count = await client.request({
      method: "eth_getBlockTransactionCountByNumber",
      params: [blockNumberHex || blockTag]
    }, { dedupe: Boolean(blockNumberHex) });
  }
  return hexToNumber(count);
}

// node_modules/viem/_esm/actions/public/getCode.js
init_formatBlockParameter();
async function getCode(client, { address, blockHash, blockNumber, blockTag = "latest", requireCanonical }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const hex = await client.request({
    method: "eth_getCode",
    params: [address, block]
  }, {
    dedupe: typeof blockNumber === "bigint" || blockHash !== undefined
  });
  if (hex === "0x")
    return;
  return hex;
}

// node_modules/viem/_esm/actions/public/getContractEvents.js
init_getAbiItem();

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
init_isAddressEqual();
init_toBytes();
init_keccak256();
init_toEventSelector();

// node_modules/viem/_esm/utils/abi/decodeEventLog.js
init_abi();
init_cursor();
init_size();
init_toEventSelector();
init_decodeAbiParameters();
init_formatAbiItem();
var docsPath7 = "/docs/contract/decodeEventLog";
function decodeEventLog(parameters) {
  const { abi, data, strict: strict_, topics } = parameters;
  const strict = strict_ ?? true;
  const [signature, ...argTopics] = topics;
  if (!signature)
    throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath7 });
  const abiItem = abi.find((x) => x.type === "event" && signature === toEventSelector(formatAbiItem(x)));
  if (!(abiItem && ("name" in abiItem)) || abiItem.type !== "event")
    throw new AbiEventSignatureNotFoundError(signature, { docsPath: docsPath7 });
  const { name, inputs } = abiItem;
  const isUnnamed = inputs?.some((x) => !(("name" in x) && x.name));
  const args = isUnnamed ? [] : {};
  const indexedInputs = inputs.map((x, i) => [x, i]).filter(([x]) => ("indexed" in x) && x.indexed);
  const missingIndexedInputs = [];
  for (let i = 0;i < indexedInputs.length; i++) {
    const [param, argIndex] = indexedInputs[i];
    const topic = argTopics[i];
    if (!topic) {
      if (strict)
        throw new DecodeLogTopicsMismatch({
          abiItem,
          param
        });
      missingIndexedInputs.push([param, argIndex]);
      continue;
    }
    args[isUnnamed ? argIndex : param.name || argIndex] = decodeTopic({
      param,
      value: topic
    });
  }
  const nonIndexedInputs = inputs.filter((x) => !(("indexed" in x) && x.indexed));
  const inputsToDecode = strict ? nonIndexedInputs : [...missingIndexedInputs.map(([param]) => param), ...nonIndexedInputs];
  if (inputsToDecode.length > 0) {
    if (data && data !== "0x") {
      try {
        const decodedData = decodeAbiParameters(inputsToDecode, data);
        if (decodedData) {
          let dataIndex = 0;
          if (!strict) {
            for (const [param, argIndex] of missingIndexedInputs) {
              args[isUnnamed ? argIndex : param.name || argIndex] = decodedData[dataIndex++];
            }
          }
          if (isUnnamed) {
            for (let i = 0;i < inputs.length; i++)
              if (args[i] === undefined && dataIndex < decodedData.length)
                args[i] = decodedData[dataIndex++];
          } else
            for (let i = 0;i < nonIndexedInputs.length; i++)
              args[nonIndexedInputs[i].name] = decodedData[dataIndex++];
        }
      } catch (err) {
        if (strict) {
          if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError)
            throw new DecodeLogDataMismatch({
              abiItem,
              data,
              params: inputsToDecode,
              size: size2(data)
            });
          throw err;
        }
      }
    } else if (strict) {
      throw new DecodeLogDataMismatch({
        abiItem,
        data: "0x",
        params: inputsToDecode,
        size: 0
      });
    }
  }
  return {
    eventName: name,
    args: Object.values(args).length > 0 ? args : undefined
  };
}
function decodeTopic({ param, value }) {
  if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    return value;
  const decodedArg = decodeAbiParameters([param], value) || [];
  return decodedArg[0];
}

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
function parseEventLogs(parameters) {
  const { abi, args, logs, strict = true } = parameters;
  const eventName = (() => {
    if (!parameters.eventName)
      return;
    if (Array.isArray(parameters.eventName))
      return parameters.eventName;
    return [parameters.eventName];
  })();
  const abiTopics = abi.filter((abiItem) => abiItem.type === "event").map((abiItem) => ({
    abi: abiItem,
    selector: toEventSelector(abiItem)
  }));
  return logs.map((log) => {
    const formattedLog = typeof log.blockNumber === "string" ? formatLog(log) : log;
    const abiItems = abiTopics.filter((abiTopic) => formattedLog.topics[0] === abiTopic.selector);
    if (abiItems.length === 0)
      return null;
    let event;
    let abiItem;
    for (const item of abiItems) {
      try {
        event = decodeEventLog({
          ...formattedLog,
          abi: [item.abi],
          strict: true
        });
        abiItem = item;
        break;
      } catch {}
    }
    if (!event && !strict) {
      abiItem = abiItems[0];
      try {
        event = decodeEventLog({
          data: formattedLog.data,
          topics: formattedLog.topics,
          abi: [abiItem.abi],
          strict: false
        });
      } catch {
        const isUnnamed = abiItem.abi.inputs?.some((x) => !(("name" in x) && x.name));
        return {
          ...formattedLog,
          args: isUnnamed ? [] : {},
          eventName: abiItem.abi.name
        };
      }
    }
    if (!event || !abiItem)
      return null;
    if (eventName && !eventName.includes(event.eventName))
      return null;
    if (!includesArgs({
      args: event.args,
      inputs: abiItem.abi.inputs,
      matchArgs: args
    }))
      return null;
    return { ...event, ...formattedLog };
  }).filter(Boolean);
}
function includesArgs(parameters) {
  const { args, inputs, matchArgs } = parameters;
  if (!matchArgs)
    return true;
  if (!args)
    return false;
  function isEqual(input, value, arg) {
    try {
      if (input.type === "address")
        return isAddressEqual(value, arg);
      if (input.type === "string" || input.type === "bytes")
        return keccak256(toBytes(value)) === arg;
      return value === arg;
    } catch {
      return false;
    }
  }
  if (Array.isArray(args) && Array.isArray(matchArgs)) {
    return matchArgs.every((value, index2) => {
      if (value === null || value === undefined)
        return true;
      const input = inputs[index2];
      if (!input)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual(input, value2, args[index2]));
    });
  }
  if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs))
    return Object.entries(matchArgs).every(([key, value]) => {
      if (value === null || value === undefined)
        return true;
      const input = inputs.find((input2) => input2.name === key);
      if (!input)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual(input, value2, args[key]));
    });
  return false;
}

// node_modules/viem/_esm/actions/public/getLogs.js
init_toHex();
async function getLogs(client, { address, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_ } = {}) {
  const strict = strict_ ?? false;
  const events = events_ ?? (event ? [event] : undefined);
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
      abi: [event2],
      eventName: event2.name,
      args: events_ ? undefined : args
    }));
    topics = [encoded];
    if (event)
      topics = topics[0];
  }
  let logs;
  if (blockHash) {
    logs = await client.request({
      method: "eth_getLogs",
      params: [{ address, topics, blockHash }]
    });
  } else {
    logs = await client.request({
      method: "eth_getLogs",
      params: [
        {
          address,
          topics,
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock
        }
      ]
    });
  }
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!events)
    return formattedLogs;
  return parseEventLogs({
    abi: events,
    args,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/actions/public/getContractEvents.js
async function getContractEvents(client, parameters) {
  const { abi, address, args, blockHash, eventName, fromBlock, toBlock, strict } = parameters;
  const event = eventName ? getAbiItem({ abi, name: eventName }) : undefined;
  const events = !event ? abi.filter((x) => x.type === "event") : undefined;
  return getAction(client, getLogs, "getLogs")({
    address,
    args,
    blockHash,
    event,
    events,
    fromBlock,
    toBlock,
    strict
  });
}

// node_modules/viem/_esm/actions/public/getDelegation.js
init_getAddress();
init_size();
init_slice();
async function getDelegation(client, { address, blockNumber, blockTag = "latest" }) {
  const code = await getCode(client, {
    address,
    ...blockNumber !== undefined ? { blockNumber } : { blockTag }
  });
  if (!code)
    return;
  if (size2(code) !== 23)
    return;
  if (!code.startsWith("0xef0100"))
    return;
  return getAddress(slice(code, 3, 23));
}

// node_modules/viem/_esm/errors/eip712.js
init_base();

class Eip712DomainNotFoundError extends BaseError {
  constructor({ address }) {
    super(`No EIP-712 domain found on contract "${address}".`, {
      metaMessages: [
        "Ensure that:",
        `- The contract is deployed at the address "${address}".`,
        "- `eip712Domain()` function exists on the contract.",
        "- `eip712Domain()` function matches signature to ERC-5267 specification."
      ],
      name: "Eip712DomainNotFoundError"
    });
  }
}

// node_modules/viem/_esm/actions/public/getEip712Domain.js
async function getEip712Domain(client, parameters) {
  const { address, factory, factoryData } = parameters;
  try {
    const [fields, name, version4, chainId, verifyingContract, salt, extensions] = await getAction(client, readContract, "readContract")({
      abi,
      address,
      functionName: "eip712Domain",
      factory,
      factoryData
    });
    return {
      domain: {
        name,
        version: version4,
        chainId: Number(chainId),
        verifyingContract,
        salt
      },
      extensions,
      fields
    };
  } catch (e) {
    const error = e;
    if (error.name === "ContractFunctionExecutionError" && error.cause.name === "ContractFunctionZeroDataError") {
      throw new Eip712DomainNotFoundError({ address });
    }
    throw error;
  }
}
var abi = [
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { name: "fields", type: "bytes1" },
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" },
      { name: "extensions", type: "uint256[]" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// node_modules/viem/_esm/actions/public/getFeeHistory.js
init_toHex();

// node_modules/viem/_esm/utils/formatters/feeHistory.js
function formatFeeHistory(feeHistory) {
  return {
    baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
    gasUsedRatio: feeHistory.gasUsedRatio,
    oldestBlock: BigInt(feeHistory.oldestBlock),
    reward: feeHistory.reward?.map((reward) => reward.map((value) => BigInt(value)))
  };
}

// node_modules/viem/_esm/actions/public/getFeeHistory.js
async function getFeeHistory(client, { blockCount, blockNumber, blockTag = "latest", rewardPercentiles }) {
  const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : undefined;
  const feeHistory = await client.request({
    method: "eth_feeHistory",
    params: [
      numberToHex(blockCount),
      blockNumberHex || blockTag,
      rewardPercentiles
    ]
  }, { dedupe: Boolean(blockNumberHex) });
  return formatFeeHistory(feeHistory);
}

// node_modules/viem/_esm/actions/public/getFilterChanges.js
async function getFilterChanges(_client, { filter }) {
  const strict = "strict" in filter && filter.strict;
  const logs = await filter.request({
    method: "eth_getFilterChanges",
    params: [filter.id]
  });
  if (typeof logs[0] === "string")
    return logs;
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!("abi" in filter) || !filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/actions/public/getFilterLogs.js
async function getFilterLogs(_client, { filter }) {
  const strict = filter.strict ?? false;
  const logs = await filter.request({
    method: "eth_getFilterLogs",
    params: [filter.id]
  });
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!filter.abi)
    return formattedLogs;
  return parseEventLogs({
    abi: filter.abi,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/actions/public/getProof.js
init_formatBlockParameter();

// node_modules/viem/_esm/utils/index.js
init_encodeFunctionData();
init_fromHex();

// node_modules/viem/_esm/utils/formatters/proof.js
function formatStorageProof(storageProof) {
  return storageProof.map((proof) => ({
    ...proof,
    value: BigInt(proof.value)
  }));
}
function formatProof(proof) {
  return {
    ...proof,
    balance: proof.balance ? BigInt(proof.balance) : undefined,
    nonce: proof.nonce ? hexToNumber(proof.nonce) : undefined,
    storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : undefined
  };
}

// node_modules/viem/_esm/actions/public/getProof.js
async function getProof(client, { address, blockHash, blockNumber, blockTag = "latest", requireCanonical, storageKeys }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const proof = await client.request({
    method: "eth_getProof",
    params: [address, storageKeys, block]
  });
  return formatProof(proof);
}

// node_modules/viem/_esm/actions/public/getRawTransaction.js
init_transaction();
async function getRawTransaction(client, { hash: hash2 }) {
  const rawTransaction = await client.request({
    method: "eth_getRawTransactionByHash",
    params: [hash2]
  }, { dedupe: true });
  if (!rawTransaction)
    throw new TransactionNotFoundError({ hash: hash2 });
  return rawTransaction;
}

// node_modules/viem/_esm/actions/public/getStorageAt.js
init_formatBlockParameter();
async function getStorageAt(client, { address, blockHash, blockNumber, blockTag = "latest", requireCanonical, slot }) {
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const data = await client.request({
    method: "eth_getStorageAt",
    params: [address, slot, block]
  });
  return data;
}

// node_modules/viem/_esm/actions/public/getTransaction.js
init_transaction();
init_toHex();
async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash: hash2, index: index2, sender, nonce }) {
  const blockTag = blockTag_ || "latest";
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  let transaction = null;
  if (hash2) {
    transaction = await client.request({
      method: "eth_getTransactionByHash",
      params: [hash2]
    }, { dedupe: true });
  } else if (blockHash) {
    transaction = await client.request({
      method: "eth_getTransactionByBlockHashAndIndex",
      params: [blockHash, numberToHex(index2)]
    }, { dedupe: true });
  } else if ((blockNumberHex || blockTag) && typeof index2 === "number") {
    transaction = await client.request({
      method: "eth_getTransactionByBlockNumberAndIndex",
      params: [blockNumberHex || blockTag, numberToHex(index2)]
    }, { dedupe: Boolean(blockNumberHex) });
  } else if (sender && typeof nonce === "number") {
    transaction = await client.request({
      method: "eth_getTransactionBySenderAndNonce",
      params: [sender, numberToHex(nonce)]
    }, { dedupe: true });
  }
  if (!transaction)
    throw new TransactionNotFoundError({
      blockHash,
      blockNumber,
      blockTag,
      hash: hash2,
      index: index2
    });
  const format2 = client.chain?.formatters?.transaction?.format || formatTransaction;
  return format2(transaction, "getTransaction");
}

// node_modules/viem/_esm/actions/public/getTransactionConfirmations.js
async function getTransactionConfirmations(client, { hash: hash2, transactionReceipt }) {
  const [blockNumber, transaction] = await Promise.all([
    getAction(client, getBlockNumber, "getBlockNumber")({}),
    hash2 ? getAction(client, getTransaction, "getTransaction")({ hash: hash2 }) : undefined
  ]);
  const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
  if (!transactionBlockNumber)
    return 0n;
  return blockNumber - transactionBlockNumber + 1n;
}

// node_modules/viem/_esm/actions/public/getTransactionReceipt.js
init_transaction();
async function getTransactionReceipt(client, { hash: hash2 }) {
  const receipt = await client.request({
    method: "eth_getTransactionReceipt",
    params: [hash2]
  }, { dedupe: true });
  if (!receipt)
    throw new TransactionReceiptNotFoundError({ hash: hash2 });
  const format2 = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
  return format2(receipt, "getTransactionReceipt");
}

// node_modules/viem/_esm/actions/public/multicall.js
init_abis();
init_abi();
init_base();
init_contract();
init_decodeFunctionResult();
init_encodeFunctionData();
init_getChainContractAddress();
async function multicall(client, parameters) {
  const { account, authorizationList, allowFailure = true, blockHash, blockNumber, blockOverrides, blockTag, requireCanonical, stateOverride } = parameters;
  const contracts = parameters.contracts;
  const batch = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const batchSize = parameters.batchSize ?? batch.batchSize ?? 1024;
  const deployless = parameters.deployless ?? batch.deployless ?? false;
  const multicallAddress = (() => {
    if (parameters.multicallAddress)
      return parameters.multicallAddress;
    if (deployless)
      return null;
    if (client.chain) {
      return getChainContractAddress({
        blockNumber,
        chain: client.chain,
        contract: "multicall3"
      });
    }
    throw new Error("client chain not configured. multicallAddress is required.");
  })();
  const chunkedCalls = [[]];
  let currentChunk = 0;
  let currentChunkSize = 0;
  for (let i = 0;i < contracts.length; i++) {
    const { abi: abi2, address, args, functionName } = contracts[i];
    try {
      const callData = encodeFunctionData({ abi: abi2, args, functionName });
      currentChunkSize += (callData.length - 2) / 2;
      if (batchSize > 0 && currentChunkSize > batchSize && chunkedCalls[currentChunk].length > 0) {
        currentChunk++;
        currentChunkSize = (callData.length - 2) / 2;
        chunkedCalls[currentChunk] = [];
      }
      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData,
          target: address
        }
      ];
    } catch (err) {
      const error = getContractError(err, {
        abi: abi2,
        address,
        args,
        docsPath: "/docs/contract/multicall",
        functionName,
        sender: account
      });
      if (!allowFailure)
        throw error;
      chunkedCalls[currentChunk] = [
        ...chunkedCalls[currentChunk],
        {
          allowFailure: true,
          callData: "0x",
          target: address
        }
      ];
    }
  }
  const aggregate3Results = await Promise.allSettled(chunkedCalls.map((calls) => getAction(client, readContract, "readContract")({
    ...multicallAddress === null ? { code: multicall3Bytecode } : { address: multicallAddress },
    abi: multicall3Abi,
    account,
    args: [calls],
    authorizationList,
    blockHash,
    blockNumber,
    blockOverrides,
    blockTag,
    functionName: "aggregate3",
    requireCanonical,
    stateOverride
  })));
  const results = [];
  for (let i = 0;i < aggregate3Results.length; i++) {
    const result = aggregate3Results[i];
    if (result.status === "rejected") {
      if (!allowFailure)
        throw result.reason;
      for (let j = 0;j < chunkedCalls[i].length; j++) {
        results.push({
          status: "failure",
          error: result.reason,
          result: undefined
        });
      }
      continue;
    }
    const aggregate3Result = result.value;
    for (let j = 0;j < aggregate3Result.length; j++) {
      const { returnData, success } = aggregate3Result[j];
      const { callData } = chunkedCalls[i][j];
      const { abi: abi2, address, functionName, args } = contracts[results.length];
      try {
        if (callData === "0x")
          throw new AbiDecodingZeroDataError;
        if (!success)
          throw new RawContractError({ data: returnData });
        const result2 = decodeFunctionResult({
          abi: abi2,
          args,
          data: returnData,
          functionName
        });
        results.push(allowFailure ? { result: result2, status: "success" } : result2);
      } catch (err) {
        const error = getContractError(err, {
          abi: abi2,
          address,
          args,
          docsPath: "/docs/contract/multicall",
          functionName
        });
        if (!allowFailure)
          throw error;
        results.push({ error, result: undefined, status: "failure" });
      }
    }
  }
  if (results.length !== contracts.length)
    throw new BaseError("multicall results mismatch");
  return results;
}

// node_modules/viem/_esm/actions/public/simulateBlocks.js
init_BlockOverrides();
init_abi();
init_contract();
init_node();
init_decodeFunctionResult();
init_encodeFunctionData();
init_toHex();
init_getNodeError();
init_transactionRequest();
init_stateOverride2();
init_assertRequest();
async function simulateBlocks(client, parameters) {
  const { blockNumber, blockTag = client.experimental_blockTag ?? "latest", blocks, returnFullTransactions, traceTransfers, validation } = parameters;
  try {
    const blockStateCalls = [];
    for (const block2 of blocks) {
      const blockOverrides = block2.blockOverrides ? toRpc2(block2.blockOverrides) : undefined;
      const calls = block2.calls.map((call_) => {
        const call2 = call_;
        const account = call2.account ? parseAccount(call2.account) : undefined;
        const data = call2.abi ? encodeFunctionData(call2) : call2.data;
        const request = {
          ...call2,
          account,
          data: call2.dataSuffix ? concat([data || "0x", call2.dataSuffix]) : data,
          from: call2.from ?? account?.address
        };
        assertRequest(request);
        return formatTransactionRequest(request);
      });
      const stateOverrides = block2.stateOverrides ? serializeStateOverride(block2.stateOverrides) : undefined;
      blockStateCalls.push({
        blockOverrides,
        calls,
        stateOverrides
      });
    }
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : undefined;
    const block = blockNumberHex || blockTag;
    const result = await client.request({
      method: "eth_simulateV1",
      params: [
        { blockStateCalls, returnFullTransactions, traceTransfers, validation },
        block
      ]
    });
    return result.map((block2, i) => ({
      ...formatBlock(block2),
      calls: block2.calls.map((call2, j) => {
        const { abi: abi2, args, functionName, to } = blocks[i].calls[j];
        const data = call2.error?.data ?? call2.returnData;
        const gasUsed = BigInt(call2.gasUsed);
        const logs = call2.logs?.map((log) => formatLog(log));
        const status = call2.status === "0x1" ? "success" : "failure";
        const result2 = abi2 && status === "success" && data !== "0x" ? decodeFunctionResult({
          abi: abi2,
          data,
          functionName
        }) : null;
        const error = (() => {
          if (status === "success")
            return;
          let error2;
          if (data === "0x")
            error2 = new AbiDecodingZeroDataError;
          else if (data)
            error2 = new RawContractError({ data });
          if (!error2)
            return;
          return getContractError(error2, {
            abi: abi2 ?? [],
            address: to ?? "0x",
            args,
            functionName: functionName ?? "<unknown>"
          });
        })();
        return {
          data,
          gasUsed,
          logs,
          status,
          ...status === "success" ? {
            result: result2
          } : {
            error
          }
        };
      })
    }));
  } catch (e) {
    const cause = e;
    const error = getNodeError(cause, {});
    if (error instanceof UnknownNodeError)
      throw cause;
    throw error;
  }
}

// node_modules/ox/_esm/core/AbiItem.js
init_exports();
init_Errors();

// node_modules/ox/_esm/core/Hash.js
init_sha3();
init_Bytes();
init_Hex();
function keccak2563(value, options = {}) {
  const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
  const bytes = keccak_256(from(value));
  if (as === "Bytes")
    return bytes;
  return fromBytes(bytes);
}

// node_modules/ox/_esm/core/AbiItem.js
init_Hex();

// node_modules/ox/_esm/core/Address.js
init_Bytes();

// node_modules/ox/_esm/core/internal/lru.js
class LruMap2 extends Map {
  constructor(size6) {
    super();
    Object.defineProperty(this, "maxSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.maxSize = size6;
  }
  get(key) {
    const value = super.get(key);
    if (super.has(key) && value !== undefined) {
      this.delete(key);
      super.set(key, value);
    }
    return value;
  }
  set(key, value) {
    super.set(key, value);
    if (this.maxSize && this.size > this.maxSize) {
      const firstKey = this.keys().next().value;
      if (firstKey)
        this.delete(firstKey);
    }
    return this;
  }
}

// node_modules/ox/_esm/core/Caches.js
var caches = {
  checksum: /* @__PURE__ */ new LruMap2(8192)
};
var checksum = caches.checksum;

// node_modules/ox/_esm/core/Address.js
init_Errors();

// node_modules/ox/_esm/core/PublicKey.js
init_Bytes();
init_Errors();
init_Hex();
function assert3(publicKey, options = {}) {
  const { compressed } = options;
  const { prefix, x, y } = publicKey;
  if (compressed === false || typeof x === "bigint" && typeof y === "bigint") {
    if (prefix !== 4)
      throw new InvalidPrefixError({
        prefix,
        cause: new InvalidUncompressedPrefixError
      });
    return;
  }
  if (compressed === true || typeof x === "bigint" && typeof y === "undefined") {
    if (prefix !== 3 && prefix !== 2)
      throw new InvalidPrefixError({
        prefix,
        cause: new InvalidCompressedPrefixError
      });
    return;
  }
  throw new InvalidError({ publicKey });
}
function from3(value) {
  const publicKey = (() => {
    if (validate2(value))
      return fromHex3(value);
    if (validate(value))
      return fromBytes3(value);
    const { prefix, x, y } = value;
    if (typeof x === "bigint" && typeof y === "bigint")
      return { prefix: prefix ?? 4, x, y };
    return { prefix, x };
  })();
  assert3(publicKey);
  return publicKey;
}
function fromBytes3(publicKey) {
  return fromHex3(fromBytes(publicKey));
}
function fromHex3(publicKey) {
  if (publicKey.length !== 132 && publicKey.length !== 130 && publicKey.length !== 68)
    throw new InvalidSerializedSizeError({ publicKey });
  if (publicKey.length === 130) {
    const x2 = BigInt(slice3(publicKey, 0, 32));
    const y = BigInt(slice3(publicKey, 32, 64));
    return {
      prefix: 4,
      x: x2,
      y
    };
  }
  if (publicKey.length === 132) {
    const prefix2 = Number(slice3(publicKey, 0, 1));
    const x2 = BigInt(slice3(publicKey, 1, 33));
    const y = BigInt(slice3(publicKey, 33, 65));
    return {
      prefix: prefix2,
      x: x2,
      y
    };
  }
  const prefix = Number(slice3(publicKey, 0, 1));
  const x = BigInt(slice3(publicKey, 1, 33));
  return {
    prefix,
    x
  };
}
function toHex3(publicKey, options = {}) {
  assert3(publicKey);
  const { prefix, x, y } = publicKey;
  const { includePrefix = true } = options;
  const publicKey_ = concat2(includePrefix ? fromNumber(prefix, { size: 1 }) : "0x", fromNumber(x, { size: 32 }), typeof y === "bigint" ? fromNumber(y, { size: 32 }) : "0x");
  return publicKey_;
}
class InvalidError extends BaseError3 {
  constructor({ publicKey }) {
    super(`Value \`${stringify2(publicKey)}\` is not a valid public key.`, {
      metaMessages: [
        "Public key must contain:",
        "- an `x` and `prefix` value (compressed)",
        "- an `x`, `y`, and `prefix` value (uncompressed)"
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidError"
    });
  }
}

class InvalidPrefixError extends BaseError3 {
  constructor({ prefix, cause }) {
    super(`Prefix "${prefix}" is invalid.`, {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidPrefixError"
    });
  }
}

class InvalidCompressedPrefixError extends BaseError3 {
  constructor() {
    super("Prefix must be 2 or 3 for compressed public keys.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidCompressedPrefixError"
    });
  }
}

class InvalidUncompressedPrefixError extends BaseError3 {
  constructor() {
    super("Prefix must be 4 for uncompressed public keys.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidUncompressedPrefixError"
    });
  }
}

class InvalidSerializedSizeError extends BaseError3 {
  constructor({ publicKey }) {
    super(`Value \`${publicKey}\` is an invalid public key size.`, {
      metaMessages: [
        "Expected: 33 bytes (compressed + prefix), 64 bytes (uncompressed) or 65 bytes (uncompressed + prefix).",
        `Received ${size4(from2(publicKey))} bytes.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "PublicKey.InvalidSerializedSizeError"
    });
  }
}

// node_modules/ox/_esm/core/Address.js
var addressRegex2 = /^0x[a-fA-F0-9]{40}$/;
function assert4(value, options = {}) {
  const { strict = true } = options;
  if (!addressRegex2.test(value))
    throw new InvalidAddressError2({
      address: value,
      cause: new InvalidInputError
    });
  if (strict) {
    if (value.toLowerCase() === value)
      return;
    if (checksum2(value) !== value)
      throw new InvalidAddressError2({
        address: value,
        cause: new InvalidChecksumError
      });
  }
}
function checksum2(address) {
  if (checksum.has(address))
    return checksum.get(address);
  assert4(address, { strict: false });
  const hexAddress = address.substring(2).toLowerCase();
  const hash2 = keccak2563(fromString(hexAddress), { as: "Bytes" });
  const characters = hexAddress.split("");
  for (let i = 0;i < 40; i += 2) {
    if (hash2[i >> 1] >> 4 >= 8 && characters[i]) {
      characters[i] = characters[i].toUpperCase();
    }
    if ((hash2[i >> 1] & 15) >= 8 && characters[i + 1]) {
      characters[i + 1] = characters[i + 1].toUpperCase();
    }
  }
  const result = `0x${characters.join("")}`;
  checksum.set(address, result);
  return result;
}
function from4(address, options = {}) {
  const { checksum: checksumVal = false } = options;
  assert4(address);
  if (checksumVal)
    return checksum2(address);
  return address;
}
function fromPublicKey(publicKey, options = {}) {
  const address = keccak2563(`0x${toHex3(publicKey).slice(4)}`).substring(26);
  return from4(`0x${address}`, options);
}
function validate3(address, options = {}) {
  const { strict = true } = options ?? {};
  try {
    assert4(address, { strict });
    return true;
  } catch {
    return false;
  }
}

class InvalidAddressError2 extends BaseError3 {
  constructor({ address, cause }) {
    super(`Address "${address}" is invalid.`, {
      cause
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidAddressError"
    });
  }
}

class InvalidInputError extends BaseError3 {
  constructor() {
    super("Address is not a 20 byte (40 hexadecimal character) value.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidInputError"
    });
  }
}

class InvalidChecksumError extends BaseError3 {
  constructor() {
    super("Address does not match its checksum counterpart.");
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Address.InvalidChecksumError"
    });
  }
}

// node_modules/ox/_esm/core/internal/abiItem.js
init_Errors();
function normalizeSignature2(signature) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i = 0;i < signature.length; i++) {
    const char = signature[i];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", "error", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError3("Unable to normalize signature.");
  return result;
}
function isArgOfType2(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case "address":
      return validate3(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter)
        return Object.values(abiParameter.components).every((component, index2) => {
          return isArgOfType2(Object.values(arg)[index2], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType2(x, {
          ...abiParameter,
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
function getAmbiguousTypes2(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes2(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes("address") && types.includes("bytes20"))
        return true;
      if (types.includes("address") && types.includes("string"))
        return validate3(args[parameterIndex], {
          strict: false
        });
      if (types.includes("address") && types.includes("bytes"))
        return validate3(args[parameterIndex], {
          strict: false
        });
      return false;
    })();
    if (ambiguous)
      return types;
  }
  return;
}

// node_modules/ox/_esm/core/AbiItem.js
function from5(abiItem, options = {}) {
  const { prepare = true } = options;
  const item = (() => {
    if (Array.isArray(abiItem))
      return parseAbiItem(abiItem);
    if (typeof abiItem === "string")
      return parseAbiItem(abiItem);
    return abiItem;
  })();
  return {
    ...item,
    ...prepare ? { hash: getSignatureHash(item) } : {}
  };
}
function fromAbi(abi2, name, options) {
  const { args = [], prepare = true } = options ?? {};
  const isSelector = validate2(name, { strict: false });
  const abiItems = abi2.filter((abiItem2) => {
    if (isSelector) {
      if (abiItem2.type === "function" || abiItem2.type === "error")
        return getSelector(abiItem2) === slice3(name, 0, 4);
      if (abiItem2.type === "event")
        return getSignatureHash(abiItem2) === name;
      return false;
    }
    return "name" in abiItem2 && abiItem2.name === name;
  });
  if (abiItems.length === 0)
    throw new NotFoundError({ name });
  if (abiItems.length === 1)
    return {
      ...abiItems[0],
      ...prepare ? { hash: getSignatureHash(abiItems[0]) } : {}
    };
  let matchedAbiItem;
  for (const abiItem2 of abiItems) {
    if (!("inputs" in abiItem2))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem2.inputs || abiItem2.inputs.length === 0)
        return {
          ...abiItem2,
          ...prepare ? { hash: getSignatureHash(abiItem2) } : {}
        };
      continue;
    }
    if (!abiItem2.inputs)
      continue;
    if (abiItem2.inputs.length === 0)
      continue;
    if (abiItem2.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index2) => {
      const abiParameter = "inputs" in abiItem2 && abiItem2.inputs[index2];
      if (!abiParameter)
        return false;
      return isArgOfType2(arg, abiParameter);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes2(abiItem2.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AmbiguityError({
            abiItem: abiItem2,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem2;
    }
  }
  const abiItem = (() => {
    if (matchedAbiItem)
      return matchedAbiItem;
    const [abiItem2, ...overloads] = abiItems;
    return { ...abiItem2, overloads };
  })();
  if (!abiItem)
    throw new NotFoundError({ name });
  return {
    ...abiItem,
    ...prepare ? { hash: getSignatureHash(abiItem) } : {}
  };
}
function getSelector(...parameters) {
  const abiItem = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, name] = parameters;
      return fromAbi(abi2, name);
    }
    return parameters[0];
  })();
  return slice3(getSignatureHash(abiItem), 0, 4);
}
function getSignature(...parameters) {
  const abiItem = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, name] = parameters;
      return fromAbi(abi2, name);
    }
    return parameters[0];
  })();
  const signature = (() => {
    if (typeof abiItem === "string")
      return abiItem;
    return formatAbiItem2(abiItem);
  })();
  return normalizeSignature2(signature);
}
function getSignatureHash(...parameters) {
  const abiItem = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, name] = parameters;
      return fromAbi(abi2, name);
    }
    return parameters[0];
  })();
  if (typeof abiItem !== "string" && "hash" in abiItem && abiItem.hash)
    return abiItem.hash;
  return keccak2563(fromString2(getSignature(abiItem)));
}

class AmbiguityError extends BaseError3 {
  constructor(x, y) {
    super("Found ambiguous types in overloaded ABI Items.", {
      metaMessages: [
        `\`${x.type}\` in \`${normalizeSignature2(formatAbiItem2(x.abiItem))}\`, and`,
        `\`${y.type}\` in \`${normalizeSignature2(formatAbiItem2(y.abiItem))}\``,
        "",
        "These types encode differently and cannot be distinguished at runtime.",
        "Remove one of the ambiguous items in the ABI."
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiItem.AmbiguityError"
    });
  }
}

class NotFoundError extends BaseError3 {
  constructor({ name, data, type = "item" }) {
    const selector = (() => {
      if (name)
        return ` with name "${name}"`;
      if (data)
        return ` with data "${data}"`;
      return "";
    })();
    super(`ABI ${type}${selector} not found.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiItem.NotFoundError"
    });
  }
}

// node_modules/ox/_esm/core/AbiParameters.js
init_exports();
init_Bytes();
init_Errors();
init_Hex();

// node_modules/ox/_esm/core/internal/abiParameters.js
init_Bytes();
init_Errors();
init_Hex();

// node_modules/ox/_esm/core/Solidity.js
var arrayRegex2 = /^(.*)\[([0-9]*)\]$/;
var bytesRegex4 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
var integerRegex4 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
var maxInt82 = 2n ** (8n - 1n) - 1n;
var maxInt162 = 2n ** (16n - 1n) - 1n;
var maxInt242 = 2n ** (24n - 1n) - 1n;
var maxInt322 = 2n ** (32n - 1n) - 1n;
var maxInt402 = 2n ** (40n - 1n) - 1n;
var maxInt482 = 2n ** (48n - 1n) - 1n;
var maxInt562 = 2n ** (56n - 1n) - 1n;
var maxInt642 = 2n ** (64n - 1n) - 1n;
var maxInt722 = 2n ** (72n - 1n) - 1n;
var maxInt802 = 2n ** (80n - 1n) - 1n;
var maxInt882 = 2n ** (88n - 1n) - 1n;
var maxInt962 = 2n ** (96n - 1n) - 1n;
var maxInt1042 = 2n ** (104n - 1n) - 1n;
var maxInt1122 = 2n ** (112n - 1n) - 1n;
var maxInt1202 = 2n ** (120n - 1n) - 1n;
var maxInt1282 = 2n ** (128n - 1n) - 1n;
var maxInt1362 = 2n ** (136n - 1n) - 1n;
var maxInt1442 = 2n ** (144n - 1n) - 1n;
var maxInt1522 = 2n ** (152n - 1n) - 1n;
var maxInt1602 = 2n ** (160n - 1n) - 1n;
var maxInt1682 = 2n ** (168n - 1n) - 1n;
var maxInt1762 = 2n ** (176n - 1n) - 1n;
var maxInt1842 = 2n ** (184n - 1n) - 1n;
var maxInt1922 = 2n ** (192n - 1n) - 1n;
var maxInt2002 = 2n ** (200n - 1n) - 1n;
var maxInt2082 = 2n ** (208n - 1n) - 1n;
var maxInt2162 = 2n ** (216n - 1n) - 1n;
var maxInt2242 = 2n ** (224n - 1n) - 1n;
var maxInt2322 = 2n ** (232n - 1n) - 1n;
var maxInt2402 = 2n ** (240n - 1n) - 1n;
var maxInt2482 = 2n ** (248n - 1n) - 1n;
var maxInt2562 = 2n ** (256n - 1n) - 1n;
var minInt82 = -(2n ** (8n - 1n));
var minInt162 = -(2n ** (16n - 1n));
var minInt242 = -(2n ** (24n - 1n));
var minInt322 = -(2n ** (32n - 1n));
var minInt402 = -(2n ** (40n - 1n));
var minInt482 = -(2n ** (48n - 1n));
var minInt562 = -(2n ** (56n - 1n));
var minInt642 = -(2n ** (64n - 1n));
var minInt722 = -(2n ** (72n - 1n));
var minInt802 = -(2n ** (80n - 1n));
var minInt882 = -(2n ** (88n - 1n));
var minInt962 = -(2n ** (96n - 1n));
var minInt1042 = -(2n ** (104n - 1n));
var minInt1122 = -(2n ** (112n - 1n));
var minInt1202 = -(2n ** (120n - 1n));
var minInt1282 = -(2n ** (128n - 1n));
var minInt1362 = -(2n ** (136n - 1n));
var minInt1442 = -(2n ** (144n - 1n));
var minInt1522 = -(2n ** (152n - 1n));
var minInt1602 = -(2n ** (160n - 1n));
var minInt1682 = -(2n ** (168n - 1n));
var minInt1762 = -(2n ** (176n - 1n));
var minInt1842 = -(2n ** (184n - 1n));
var minInt1922 = -(2n ** (192n - 1n));
var minInt2002 = -(2n ** (200n - 1n));
var minInt2082 = -(2n ** (208n - 1n));
var minInt2162 = -(2n ** (216n - 1n));
var minInt2242 = -(2n ** (224n - 1n));
var minInt2322 = -(2n ** (232n - 1n));
var minInt2402 = -(2n ** (240n - 1n));
var minInt2482 = -(2n ** (248n - 1n));
var minInt2562 = -(2n ** (256n - 1n));
var maxUint82 = 2n ** 8n - 1n;
var maxUint162 = 2n ** 16n - 1n;
var maxUint242 = 2n ** 24n - 1n;
var maxUint322 = 2n ** 32n - 1n;
var maxUint402 = 2n ** 40n - 1n;
var maxUint482 = 2n ** 48n - 1n;
var maxUint562 = 2n ** 56n - 1n;
var maxUint642 = 2n ** 64n - 1n;
var maxUint722 = 2n ** 72n - 1n;
var maxUint802 = 2n ** 80n - 1n;
var maxUint882 = 2n ** 88n - 1n;
var maxUint962 = 2n ** 96n - 1n;
var maxUint1042 = 2n ** 104n - 1n;
var maxUint1122 = 2n ** 112n - 1n;
var maxUint1202 = 2n ** 120n - 1n;
var maxUint1282 = 2n ** 128n - 1n;
var maxUint1362 = 2n ** 136n - 1n;
var maxUint1442 = 2n ** 144n - 1n;
var maxUint1522 = 2n ** 152n - 1n;
var maxUint1602 = 2n ** 160n - 1n;
var maxUint1682 = 2n ** 168n - 1n;
var maxUint1762 = 2n ** 176n - 1n;
var maxUint1842 = 2n ** 184n - 1n;
var maxUint1922 = 2n ** 192n - 1n;
var maxUint2002 = 2n ** 200n - 1n;
var maxUint2082 = 2n ** 208n - 1n;
var maxUint2162 = 2n ** 216n - 1n;
var maxUint2242 = 2n ** 224n - 1n;
var maxUint2322 = 2n ** 232n - 1n;
var maxUint2402 = 2n ** 240n - 1n;
var maxUint2482 = 2n ** 248n - 1n;
var maxUint2562 = 2n ** 256n - 1n;

// node_modules/ox/_esm/core/internal/abiParameters.js
function decodeParameter2(cursor, param, options) {
  const { checksumAddress: checksumAddress2, staticPosition } = options;
  const arrayComponents = getArrayComponents2(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray2(cursor, { ...param, type }, { checksumAddress: checksumAddress2, length, staticPosition });
  }
  if (param.type === "tuple")
    return decodeTuple2(cursor, param, {
      checksumAddress: checksumAddress2,
      staticPosition
    });
  if (param.type === "address")
    return decodeAddress3(cursor, { checksum: checksumAddress2 });
  if (param.type === "bool")
    return decodeBool2(cursor);
  if (param.type.startsWith("bytes"))
    return decodeBytes2(cursor, param, { staticPosition });
  if (param.type.startsWith("uint") || param.type.startsWith("int"))
    return decodeNumber2(cursor, param);
  if (param.type === "string")
    return decodeString2(cursor, { staticPosition });
  throw new InvalidTypeError(param.type);
}
var sizeOfLength2 = 32;
var sizeOfOffset2 = 32;
function decodeAddress3(cursor, options = {}) {
  const { checksum: checksum3 = false } = options;
  const value = cursor.readBytes(32);
  const wrap = (address) => checksum3 ? checksum2(address) : address;
  return [wrap(fromBytes(slice2(value, -20))), 32];
}
function decodeArray2(cursor, param, options) {
  const { checksumAddress: checksumAddress2, length, staticPosition } = options;
  if (!length) {
    const offset = toNumber2(cursor.readBytes(sizeOfOffset2));
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength2;
    cursor.setPosition(start);
    const length2 = toNumber2(cursor.readBytes(sizeOfLength2));
    const dynamicChild = hasDynamicChild2(param);
    let consumed2 = 0;
    const value2 = [];
    for (let i = 0;i < length2; ++i) {
      cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
      const [data, consumed_] = decodeParameter2(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition: startOfData
      });
      consumed2 += consumed_;
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  if (hasDynamicChild2(param)) {
    const offset = toNumber2(cursor.readBytes(sizeOfOffset2));
    const start = staticPosition + offset;
    const value2 = [];
    for (let i = 0;i < length; ++i) {
      cursor.setPosition(start + i * 32);
      const [data] = decodeParameter2(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition: start
      });
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  let consumed = 0;
  const value = [];
  for (let i = 0;i < length; ++i) {
    const [data, consumed_] = decodeParameter2(cursor, param, {
      checksumAddress: checksumAddress2,
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
  }
  return [value, consumed];
}
function decodeBool2(cursor) {
  return [toBoolean(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes2(cursor, param, { staticPosition }) {
  const [_, size6] = param.type.split("bytes");
  if (!size6) {
    const offset = toNumber2(cursor.readBytes(32));
    cursor.setPosition(staticPosition + offset);
    const length = toNumber2(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["0x", 32];
    }
    const data = cursor.readBytes(length);
    cursor.setPosition(staticPosition + 32);
    return [fromBytes(data), 32];
  }
  const value = fromBytes(cursor.readBytes(Number.parseInt(size6, 10), 32));
  return [value, 32];
}
function decodeNumber2(cursor, param) {
  const signed = param.type.startsWith("int");
  const size6 = Number.parseInt(param.type.split("int")[1] || "256", 10);
  const value = cursor.readBytes(32);
  return [
    size6 > 48 ? toBigInt2(value, { signed }) : toNumber2(value, { signed }),
    32
  ];
}
function decodeTuple2(cursor, param, options) {
  const { checksumAddress: checksumAddress2, staticPosition } = options;
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild2(param)) {
    const offset = toNumber2(cursor.readBytes(sizeOfOffset2));
    const start = staticPosition + offset;
    for (let i = 0;i < param.components.length; ++i) {
      const component = param.components[i];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter2(cursor, component, {
        checksumAddress: checksumAddress2,
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i : component?.name] = data;
    }
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  for (let i = 0;i < param.components.length; ++i) {
    const component = param.components[i];
    const [data, consumed_] = decodeParameter2(cursor, component, {
      checksumAddress: checksumAddress2,
      staticPosition
    });
    value[hasUnnamedChild ? i : component?.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString2(cursor, { staticPosition }) {
  const offset = toNumber2(cursor.readBytes(32));
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = toNumber2(cursor.readBytes(32));
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ["", 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = toString(trimLeft(data));
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function prepareParameters({ checksumAddress: checksumAddress2, parameters, values }) {
  const preparedParameters = [];
  for (let i = 0;i < parameters.length; i++) {
    preparedParameters.push(prepareParameter({
      checksumAddress: checksumAddress2,
      parameter: parameters[i],
      value: values[i]
    }));
  }
  return preparedParameters;
}
function prepareParameter({ checksumAddress: checksumAddress2 = false, parameter: parameter_, value }) {
  const parameter = parameter_;
  const arrayComponents = getArrayComponents2(parameter.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray2(value, {
      checksumAddress: checksumAddress2,
      length,
      parameter: {
        ...parameter,
        type
      }
    });
  }
  if (parameter.type === "tuple") {
    return encodeTuple2(value, {
      checksumAddress: checksumAddress2,
      parameter
    });
  }
  if (parameter.type === "address") {
    return encodeAddress2(value, {
      checksum: checksumAddress2
    });
  }
  if (parameter.type === "bool") {
    return encodeBoolean(value);
  }
  if (parameter.type.startsWith("uint") || parameter.type.startsWith("int")) {
    const signed = parameter.type.startsWith("int");
    const [, , size6 = "256"] = integerRegex4.exec(parameter.type) ?? [];
    return encodeNumber2(value, {
      signed,
      size: Number(size6)
    });
  }
  if (parameter.type.startsWith("bytes")) {
    return encodeBytes2(value, { type: parameter.type });
  }
  if (parameter.type === "string") {
    return encodeString2(value);
  }
  throw new InvalidTypeError(parameter.type);
}
function encode(preparedParameters) {
  let staticSize = 0;
  for (let i = 0;i < preparedParameters.length; i++) {
    const { dynamic, encoded } = preparedParameters[i];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size4(encoded);
  }
  const staticParameters = [];
  const dynamicParameters = [];
  let dynamicSize = 0;
  for (let i = 0;i < preparedParameters.length; i++) {
    const { dynamic, encoded } = preparedParameters[i];
    if (dynamic) {
      staticParameters.push(fromNumber(staticSize + dynamicSize, { size: 32 }));
      dynamicParameters.push(encoded);
      dynamicSize += size4(encoded);
    } else {
      staticParameters.push(encoded);
    }
  }
  return concat2(...staticParameters, ...dynamicParameters);
}
function encodeAddress2(value, options) {
  const { checksum: checksum3 = false } = options;
  assert4(value, { strict: checksum3 });
  return {
    dynamic: false,
    encoded: padLeft(value.toLowerCase())
  };
}
function encodeArray2(value, options) {
  const { checksumAddress: checksumAddress2, length, parameter } = options;
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError2(value);
  if (!dynamic && value.length !== length)
    throw new ArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${parameter.type}[${length}]`
    });
  let dynamicChild = false;
  const preparedParameters = [];
  for (let i = 0;i < value.length; i++) {
    const preparedParam = prepareParameter({
      checksumAddress: checksumAddress2,
      parameter,
      value: value[i]
    });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParameters.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encode(preparedParameters);
    if (dynamic) {
      const length2 = fromNumber(preparedParameters.length, { size: 32 });
      return {
        dynamic: true,
        encoded: preparedParameters.length > 0 ? concat2(length2, data) : length2
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concat2(...preparedParameters.map(({ encoded }) => encoded))
  };
}
function encodeBytes2(value, { type }) {
  const [, parametersize] = type.split("bytes");
  const bytesSize = size4(value);
  if (!parametersize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padRight(value_, Math.ceil((value.length - 2) / 2 / 32) * 32);
    return {
      dynamic: true,
      encoded: concat2(padLeft(fromNumber(bytesSize, { size: 32 })), value_)
    };
  }
  if (bytesSize !== Number.parseInt(parametersize, 10))
    throw new BytesSizeMismatchError2({
      expectedSize: Number.parseInt(parametersize, 10),
      value
    });
  return { dynamic: false, encoded: padRight(value) };
}
function encodeBoolean(value) {
  if (typeof value !== "boolean")
    throw new BaseError3(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padLeft(fromBoolean(value)) };
}
function encodeNumber2(value, { signed, size: size6 }) {
  if (typeof size6 === "number") {
    const max = 2n ** (BigInt(size6) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError2({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size6 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: fromNumber(value, {
      size: 32,
      signed
    })
  };
}
function encodeString2(value) {
  const hexValue = fromString2(value);
  const partsLength = Math.ceil(size4(hexValue) / 32);
  const parts = [];
  for (let i = 0;i < partsLength; i++) {
    parts.push(padRight(slice3(hexValue, i * 32, (i + 1) * 32)));
  }
  return {
    dynamic: true,
    encoded: concat2(padRight(fromNumber(size4(hexValue), { size: 32 })), ...parts)
  };
}
function encodeTuple2(value, options) {
  const { checksumAddress: checksumAddress2, parameter } = options;
  let dynamic = false;
  const preparedParameters = [];
  for (let i = 0;i < parameter.components.length; i++) {
    const param_ = parameter.components[i];
    const index2 = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParameter({
      checksumAddress: checksumAddress2,
      parameter: param_,
      value: value[index2]
    });
    preparedParameters.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encode(preparedParameters) : concat2(...preparedParameters.map(({ encoded }) => encoded))
  };
}
function getArrayComponents2(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? [matches[2] ? Number(matches[2]) : null, matches[1]] : undefined;
}
function hasDynamicChild2(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components?.some(hasDynamicChild2);
  const arrayComponents = getArrayComponents2(param.type);
  if (arrayComponents && hasDynamicChild2({
    ...param,
    type: arrayComponents[1]
  }))
    return true;
  return false;
}

// node_modules/ox/_esm/core/internal/cursor.js
init_Errors();
var staticCursor2 = {
  bytes: new Uint8Array,
  dataView: new DataView(new ArrayBuffer(0)),
  position: 0,
  positionReadCount: new Map,
  recursiveReadCount: 0,
  recursiveReadLimit: Number.POSITIVE_INFINITY,
  assertReadLimit() {
    if (this.recursiveReadCount >= this.recursiveReadLimit)
      throw new RecursiveReadLimitExceededError2({
        count: this.recursiveReadCount + 1,
        limit: this.recursiveReadLimit
      });
  },
  assertPosition(position) {
    if (position < 0 || position > this.bytes.length - 1)
      throw new PositionOutOfBoundsError2({
        length: this.bytes.length,
        position
      });
  },
  decrementPosition(offset) {
    if (offset < 0)
      throw new NegativeOffsetError2({ offset });
    const position = this.position - offset;
    this.assertPosition(position);
    this.position = position;
  },
  getReadCount(position) {
    return this.positionReadCount.get(position || this.position) || 0;
  },
  incrementPosition(offset) {
    if (offset < 0)
      throw new NegativeOffsetError2({ offset });
    const position = this.position + offset;
    this.assertPosition(position);
    this.position = position;
  },
  inspectByte(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectBytes(length, position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + length - 1);
    return this.bytes.subarray(position, position + length);
  },
  inspectUint8(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectUint16(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 1);
    return this.dataView.getUint16(position);
  },
  inspectUint24(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 2);
    return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
  },
  inspectUint32(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 3);
    return this.dataView.getUint32(position);
  },
  pushByte(byte) {
    this.assertPosition(this.position);
    this.bytes[this.position] = byte;
    this.position++;
  },
  pushBytes(bytes) {
    this.assertPosition(this.position + bytes.length - 1);
    this.bytes.set(bytes, this.position);
    this.position += bytes.length;
  },
  pushUint8(value) {
    this.assertPosition(this.position);
    this.bytes[this.position] = value;
    this.position++;
  },
  pushUint16(value) {
    this.assertPosition(this.position + 1);
    this.dataView.setUint16(this.position, value);
    this.position += 2;
  },
  pushUint24(value) {
    this.assertPosition(this.position + 2);
    this.dataView.setUint16(this.position, value >> 8);
    this.dataView.setUint8(this.position + 2, value & ~4294967040);
    this.position += 3;
  },
  pushUint32(value) {
    this.assertPosition(this.position + 3);
    this.dataView.setUint32(this.position, value);
    this.position += 4;
  },
  readByte() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectByte();
    this.position++;
    return value;
  },
  readBytes(length, size6) {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectBytes(length);
    this.position += size6 ?? length;
    return value;
  },
  readUint8() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint8();
    this.position += 1;
    return value;
  },
  readUint16() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint16();
    this.position += 2;
    return value;
  },
  readUint24() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint24();
    this.position += 3;
    return value;
  },
  readUint32() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint32();
    this.position += 4;
    return value;
  },
  get remaining() {
    return this.bytes.length - this.position;
  },
  setPosition(position) {
    const oldPosition = this.position;
    this.assertPosition(position);
    this.position = position;
    return () => this.position = oldPosition;
  },
  _touch() {
    if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
      return;
    const count = this.getReadCount();
    this.positionReadCount.set(this.position, count + 1);
    if (count > 0)
      this.recursiveReadCount++;
  }
};
function create(bytes, { recursiveReadLimit = 8192 } = {}) {
  const cursor = Object.create(staticCursor2);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = new Map;
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}

class NegativeOffsetError2 extends BaseError3 {
  constructor({ offset }) {
    super(`Offset \`${offset}\` cannot be negative.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Cursor.NegativeOffsetError"
    });
  }
}

class PositionOutOfBoundsError2 extends BaseError3 {
  constructor({ length, position }) {
    super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Cursor.PositionOutOfBoundsError"
    });
  }
}

class RecursiveReadLimitExceededError2 extends BaseError3 {
  constructor({ count, limit }) {
    super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Cursor.RecursiveReadLimitExceededError"
    });
  }
}

// node_modules/ox/_esm/core/AbiParameters.js
function decode(parameters, data, options = {}) {
  const { as = "Array", checksumAddress: checksumAddress2 = false } = options;
  const bytes = typeof data === "string" ? fromHex(data) : data;
  const cursor = create(bytes);
  if (size3(bytes) === 0 && parameters.length > 0)
    throw new ZeroDataError;
  if (size3(bytes) && size3(bytes) < 32)
    throw new DataSizeTooSmallError({
      data: typeof data === "string" ? data : fromBytes(data),
      parameters,
      size: size3(bytes)
    });
  let consumed = 0;
  const values = as === "Array" ? [] : {};
  for (let i = 0;i < parameters.length; ++i) {
    const param = parameters[i];
    cursor.setPosition(consumed);
    const [data2, consumed_] = decodeParameter2(cursor, param, {
      checksumAddress: checksumAddress2,
      staticPosition: 0
    });
    consumed += consumed_;
    if (as === "Array")
      values.push(data2);
    else
      values[param.name ?? i] = data2;
  }
  return values;
}
function encode2(parameters, values, options) {
  const { checksumAddress: checksumAddress2 = false } = options ?? {};
  if (parameters.length !== values.length)
    throw new LengthMismatchError({
      expectedLength: parameters.length,
      givenLength: values.length
    });
  const preparedParameters = prepareParameters({
    checksumAddress: checksumAddress2,
    parameters,
    values
  });
  const data = encode(preparedParameters);
  if (data.length === 0)
    return "0x";
  return data;
}
function encodePacked2(types, values) {
  if (types.length !== values.length)
    throw new LengthMismatchError({
      expectedLength: types.length,
      givenLength: values.length
    });
  const data = [];
  for (let i = 0;i < types.length; i++) {
    const type = types[i];
    const value = values[i];
    data.push(encodePacked2.encode(type, value));
  }
  return concat2(...data);
}
(function(encodePacked3) {
  function encode3(type, value, isArray = false) {
    if (type === "address") {
      const address = value;
      assert4(address);
      return padLeft(address.toLowerCase(), isArray ? 32 : 0);
    }
    if (type === "string")
      return fromString2(value);
    if (type === "bytes")
      return value;
    if (type === "bool")
      return padLeft(fromBoolean(value), isArray ? 32 : 1);
    const intMatch = type.match(integerRegex4);
    if (intMatch) {
      const [_type, baseType, bits = "256"] = intMatch;
      const size6 = Number.parseInt(bits, 10) / 8;
      return fromNumber(value, {
        size: isArray ? 32 : size6,
        signed: baseType === "int"
      });
    }
    const bytesMatch = type.match(bytesRegex4);
    if (bytesMatch) {
      const [_type, size6] = bytesMatch;
      if (Number.parseInt(size6, 10) !== (value.length - 2) / 2)
        throw new BytesSizeMismatchError2({
          expectedSize: Number.parseInt(size6, 10),
          value
        });
      return padRight(value, isArray ? 32 : 0);
    }
    const arrayMatch = type.match(arrayRegex2);
    if (arrayMatch && Array.isArray(value)) {
      const [_type, childType] = arrayMatch;
      const data = [];
      for (let i = 0;i < value.length; i++) {
        data.push(encode3(childType, value[i], true));
      }
      if (data.length === 0)
        return "0x";
      return concat2(...data);
    }
    throw new InvalidTypeError(type);
  }
  encodePacked3.encode = encode3;
})(encodePacked2 || (encodePacked2 = {}));
function from6(parameters) {
  if (Array.isArray(parameters) && typeof parameters[0] === "string")
    return parseAbiParameters(parameters);
  if (typeof parameters === "string")
    return parseAbiParameters(parameters);
  return parameters;
}

class DataSizeTooSmallError extends BaseError3 {
  constructor({ data, parameters, size: size6 }) {
    super(`Data size of ${size6} bytes is too small for given parameters.`, {
      metaMessages: [
        `Params: (${formatAbiParameters(parameters)})`,
        `Data:   ${data} (${size6} bytes)`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.DataSizeTooSmallError"
    });
  }
}

class ZeroDataError extends BaseError3 {
  constructor() {
    super('Cannot decode zero data ("0x") with ABI parameters.');
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.ZeroDataError"
    });
  }
}

class ArrayLengthMismatchError extends BaseError3 {
  constructor({ expectedLength, givenLength, type }) {
    super(`Array length mismatch for type \`${type}\`. Expected: \`${expectedLength}\`. Given: \`${givenLength}\`.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.ArrayLengthMismatchError"
    });
  }
}

class BytesSizeMismatchError2 extends BaseError3 {
  constructor({ expectedSize, value }) {
    super(`Size of bytes "${value}" (bytes${size4(value)}) does not match expected size (bytes${expectedSize}).`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.BytesSizeMismatchError"
    });
  }
}

class LengthMismatchError extends BaseError3 {
  constructor({ expectedLength, givenLength }) {
    super([
      "ABI encoding parameters/values length mismatch.",
      `Expected length (parameters): ${expectedLength}`,
      `Given length (values): ${givenLength}`
    ].join(`
`));
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.LengthMismatchError"
    });
  }
}

class InvalidArrayError2 extends BaseError3 {
  constructor(value) {
    super(`Value \`${value}\` is not a valid array.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.InvalidArrayError"
    });
  }
}

class InvalidTypeError extends BaseError3 {
  constructor(type) {
    super(`Type \`${type}\` is not a valid ABI Type.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "AbiParameters.InvalidTypeError"
    });
  }
}

// node_modules/ox/_esm/core/AbiConstructor.js
init_Hex();
function encode3(...parameters) {
  const [abiConstructor, options] = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, options2] = parameters;
      return [fromAbi2(abi2), options2];
    }
    return parameters;
  })();
  const { bytecode, args } = options;
  return concat2(bytecode, abiConstructor.inputs?.length && args?.length ? encode2(abiConstructor.inputs, args) : "0x");
}
function from7(abiConstructor) {
  return from5(abiConstructor);
}
function fromAbi2(abi2) {
  const item = abi2.find((item2) => item2.type === "constructor");
  if (!item)
    throw new NotFoundError({ name: "constructor" });
  return item;
}

// node_modules/ox/_esm/core/AbiFunction.js
init_Hex();
function encodeData(...parameters) {
  const [abiFunction, args = []] = (() => {
    if (Array.isArray(parameters[0])) {
      const [abi2, name, args3] = parameters;
      return [fromAbi3(abi2, name, { args: args3 }), args3];
    }
    const [abiFunction2, args2] = parameters;
    return [abiFunction2, args2];
  })();
  const { overloads } = abiFunction;
  const item = overloads ? fromAbi3([abiFunction, ...overloads], abiFunction.name, {
    args
  }) : abiFunction;
  const selector = getSelector2(item);
  const data = args.length > 0 ? encode2(item.inputs, args) : undefined;
  return data ? concat2(selector, data) : selector;
}
function from8(abiFunction, options = {}) {
  return from5(abiFunction, options);
}
function fromAbi3(abi2, name, options) {
  const item = fromAbi(abi2, name, options);
  if (item.type !== "function")
    throw new NotFoundError({ name, type: "function" });
  return item;
}
function getSelector2(abiItem) {
  return getSelector(abiItem);
}
// node_modules/viem/_esm/constants/address.js
var ethAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
var zeroAddress = "0x0000000000000000000000000000000000000000";

// node_modules/viem/_esm/actions/public/simulateCalls.js
init_base();
init_encodeFunctionData();
var getBalanceCode = "0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033";
async function simulateCalls(client, parameters) {
  const { blockNumber, blockTag, calls, stateOverrides, traceAssetChanges, traceTransfers, validation } = parameters;
  const account = parameters.account ? parseAccount(parameters.account) : undefined;
  if (traceAssetChanges && !account)
    throw new BaseError("`account` is required when `traceAssetChanges` is true");
  const getBalanceData = account ? encode3(from7("constructor(bytes, bytes)"), {
    bytecode: deploylessCallViaBytecodeBytecode,
    args: [
      getBalanceCode,
      encodeData(from8("function getBalance(address)"), [account.address])
    ]
  }) : undefined;
  const assetAddresses = traceAssetChanges ? await Promise.all(parameters.calls.map(async (call2) => {
    if (!call2.data && !call2.abi)
      return;
    const { accessList } = await createAccessList(client, {
      account: account.address,
      ...call2,
      data: call2.abi ? encodeFunctionData(call2) : call2.data
    });
    return accessList.map(({ address, storageKeys }) => storageKeys.length > 0 ? address : null);
  })).then((x) => x.flat().filter(Boolean)) : [];
  const blocks = await simulateBlocks(client, {
    blockNumber,
    blockTag,
    blocks: [
      ...traceAssetChanges ? [
        {
          calls: [{ data: getBalanceData }],
          stateOverrides
        },
        {
          calls: assetAddresses.map((address, i) => ({
            abi: [
              from8("function balanceOf(address) returns (uint256)")
            ],
            functionName: "balanceOf",
            args: [account.address],
            to: address,
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        }
      ] : [],
      {
        calls: [...calls, { to: zeroAddress }].map((call2) => ({
          ...call2,
          from: account?.address
        })),
        stateOverrides
      },
      ...traceAssetChanges ? [
        {
          calls: [{ data: getBalanceData }]
        },
        {
          calls: assetAddresses.map((address, i) => ({
            abi: [
              from8("function balanceOf(address) returns (uint256)")
            ],
            functionName: "balanceOf",
            args: [account.address],
            to: address,
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        },
        {
          calls: assetAddresses.map((address, i) => ({
            to: address,
            abi: [
              from8("function decimals() returns (uint256)")
            ],
            functionName: "decimals",
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        },
        {
          calls: assetAddresses.map((address, i) => ({
            to: address,
            abi: [
              from8("function tokenURI(uint256) returns (string)")
            ],
            functionName: "tokenURI",
            args: [0n],
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        },
        {
          calls: assetAddresses.map((address, i) => ({
            to: address,
            abi: [from8("function symbol() returns (string)")],
            functionName: "symbol",
            from: zeroAddress,
            nonce: i
          })),
          stateOverrides: [
            {
              address: zeroAddress,
              nonce: 0
            }
          ]
        }
      ] : []
    ],
    traceTransfers,
    validation
  });
  const block_results = traceAssetChanges ? blocks[2] : blocks[0];
  const [block_ethPre, block_assetsPre, , block_ethPost, block_assetsPost, block_decimals, block_tokenURI, block_symbols] = traceAssetChanges ? blocks : [];
  const { calls: block_calls, ...block } = block_results;
  const results = block_calls.slice(0, -1) ?? [];
  const ethPre = block_ethPre?.calls ?? [];
  const assetsPre = block_assetsPre?.calls ?? [];
  const balancesPre = [...ethPre, ...assetsPre].map((call2) => call2.status === "success" ? hexToBigInt(call2.data) : null);
  const ethPost = block_ethPost?.calls ?? [];
  const assetsPost = block_assetsPost?.calls ?? [];
  const balancesPost = [...ethPost, ...assetsPost].map((call2) => call2.status === "success" ? hexToBigInt(call2.data) : null);
  const decimals = (block_decimals?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
  const symbols = (block_symbols?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
  const tokenURI = (block_tokenURI?.calls ?? []).map((x) => x.status === "success" ? x.result : null);
  const changes = [];
  for (const [i, balancePost] of balancesPost.entries()) {
    const balancePre = balancesPre[i];
    if (typeof balancePost !== "bigint")
      continue;
    if (typeof balancePre !== "bigint")
      continue;
    const decimals_ = decimals[i - 1];
    const symbol_ = symbols[i - 1];
    const tokenURI_ = tokenURI[i - 1];
    const token = (() => {
      if (i === 0)
        return {
          address: ethAddress,
          decimals: 18,
          symbol: "ETH"
        };
      return {
        address: assetAddresses[i - 1],
        decimals: tokenURI_ || decimals_ ? Number(decimals_ ?? 1) : undefined,
        symbol: symbol_ ?? undefined
      };
    })();
    if (changes.some((change) => change.token.address === token.address))
      continue;
    changes.push({
      token,
      value: {
        pre: balancePre,
        post: balancePost,
        diff: balancePost - balancePre
      }
    });
  }
  return {
    assetChanges: changes,
    block,
    results
  };
}

// node_modules/viem/_esm/actions/public/simulateContract.js
init_decodeFunctionResult();
init_encodeFunctionData();
init_call();
async function simulateContract(client, parameters) {
  const { abi: abi2, address, args, functionName, dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : client.dataSuffix?.value, ...callRequest } = parameters;
  const account = callRequest.account ? parseAccount(callRequest.account) : client.account;
  const calldata = encodeFunctionData({ abi: abi2, args, functionName });
  try {
    const { data } = await getAction(client, call, "call")({
      batch: false,
      data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
      to: address,
      ...callRequest,
      account
    });
    const result = decodeFunctionResult({
      abi: abi2,
      args,
      functionName,
      data: data || "0x"
    });
    const minimizedAbi = abi2.filter((abiItem) => ("name" in abiItem) && abiItem.name === parameters.functionName);
    return {
      result,
      request: {
        abi: minimizedAbi,
        address,
        args,
        dataSuffix,
        functionName,
        ...callRequest,
        account
      }
    };
  } catch (error) {
    throw getContractError(error, {
      abi: abi2,
      address,
      args,
      docsPath: "/docs/contract/simulateContract",
      functionName,
      sender: account?.address
    });
  }
}

// node_modules/viem/_esm/actions/public/uninstallFilter.js
async function uninstallFilter(_client, { filter }) {
  return filter.request({
    method: "eth_uninstallFilter",
    params: [filter.id]
  });
}

// node_modules/ox/_esm/erc6492/SignatureErc6492.js
var exports_SignatureErc6492 = {};
__export(exports_SignatureErc6492, {
  wrap: () => wrap,
  validate: () => validate4,
  unwrap: () => unwrap,
  universalSignatureValidatorBytecode: () => universalSignatureValidatorBytecode,
  universalSignatureValidatorAbi: () => universalSignatureValidatorAbi,
  magicBytes: () => magicBytes,
  from: () => from9,
  assert: () => assert5,
  InvalidWrappedSignatureError: () => InvalidWrappedSignatureError
});
init_Errors();
init_Hex();
var magicBytes = "0x6492649264926492649264926492649264926492649264926492649264926492";
var universalSignatureValidatorBytecode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
var universalSignatureValidatorAbi = [
  {
    inputs: [
      {
        name: "_signer",
        type: "address"
      },
      {
        name: "_hash",
        type: "bytes32"
      },
      {
        name: "_signature",
        type: "bytes"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        name: "_signer",
        type: "address"
      },
      {
        name: "_hash",
        type: "bytes32"
      },
      {
        name: "_signature",
        type: "bytes"
      }
    ],
    outputs: [
      {
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function",
    name: "isValidSig"
  }
];
function assert5(wrapped) {
  if (slice3(wrapped, -32) !== magicBytes)
    throw new InvalidWrappedSignatureError(wrapped);
}
function from9(wrapped) {
  if (typeof wrapped === "string")
    return unwrap(wrapped);
  return wrapped;
}
function unwrap(wrapped) {
  assert5(wrapped);
  const [to, data, signature] = decode(from6("address, bytes, bytes"), wrapped);
  return { data, signature, to };
}
function wrap(value) {
  const { data, signature, to } = value;
  return concat2(encode2(from6("address, bytes, bytes"), [
    to,
    data,
    signature
  ]), magicBytes);
}
function validate4(wrapped) {
  try {
    assert5(wrapped);
    return true;
  } catch {
    return false;
  }
}

class InvalidWrappedSignatureError extends BaseError3 {
  constructor(wrapped) {
    super(`Value \`${wrapped}\` is an invalid ERC-6492 wrapped signature.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "SignatureErc6492.InvalidWrappedSignatureError"
    });
  }
}
// node_modules/ox/_esm/erc8010/SignatureErc8010.js
var exports_SignatureErc8010 = {};
__export(exports_SignatureErc8010, {
  wrap: () => wrap2,
  validate: () => validate5,
  unwrap: () => unwrap2,
  suffixParameters: () => suffixParameters,
  magicBytes: () => magicBytes2,
  from: () => from13,
  assert: () => assert7,
  InvalidWrappedSignatureError: () => InvalidWrappedSignatureError2
});

// node_modules/ox/_esm/core/Authorization.js
init_Hex();

// node_modules/ox/_esm/core/Rlp.js
init_Bytes();
init_Errors();
init_Hex();
function from10(value, options) {
  const { as } = options;
  const encodable = getEncodable2(value);
  const cursor = create(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (as === "Hex")
    return fromBytes(cursor.bytes);
  return cursor.bytes;
}
function fromHex4(hex, options = {}) {
  const { as = "Hex" } = options;
  return from10(hex, { as });
}
function getEncodable2(bytes) {
  if (Array.isArray(bytes))
    return getEncodableList2(bytes.map((x) => getEncodable2(x)));
  return getEncodableBytes2(bytes);
}
function getEncodableList2(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength2(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(192 + bodyLength);
      } else {
        cursor.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor.pushUint24(bodyLength);
        else
          cursor.pushUint32(bodyLength);
      }
      for (const { encode: encode4 } of list) {
        encode4(cursor);
      }
    }
  };
}
function getEncodableBytes2(bytesOrHex) {
  const bytes = typeof bytesOrHex === "string" ? fromHex(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength2(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 128)
      return 1;
    if (bytes.length <= 55)
      return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 128) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(128 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor.pushUint8(bytes.length);
        else if (sizeOfBytesLength === 2)
          cursor.pushUint16(bytes.length);
        else if (sizeOfBytesLength === 3)
          cursor.pushUint24(bytes.length);
        else
          cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength2(length) {
  if (length <= 255)
    return 1;
  if (length <= 65535)
    return 2;
  if (length <= 16777215)
    return 3;
  if (length <= 4294967295)
    return 4;
  throw new BaseError3("Length is too large.");
}

// node_modules/ox/_esm/core/Signature.js
init_Errors();
init_Hex();
function assert6(signature, options = {}) {
  const { recovered } = options;
  if (typeof signature.r === "undefined")
    throw new MissingPropertiesError({ signature });
  if (typeof signature.s === "undefined")
    throw new MissingPropertiesError({ signature });
  if (recovered && typeof signature.yParity === "undefined")
    throw new MissingPropertiesError({ signature });
  if (signature.r < 0n || signature.r > maxUint2562)
    throw new InvalidRError({ value: signature.r });
  if (signature.s < 0n || signature.s > maxUint2562)
    throw new InvalidSError({ value: signature.s });
  if (typeof signature.yParity === "number" && signature.yParity !== 0 && signature.yParity !== 1)
    throw new InvalidYParityError({ value: signature.yParity });
}
function fromBytes4(signature) {
  return fromHex5(fromBytes(signature));
}
function fromHex5(signature) {
  if (signature.length !== 130 && signature.length !== 132)
    throw new InvalidSerializedSizeError2({ signature });
  const r = BigInt(slice3(signature, 0, 32));
  const s = BigInt(slice3(signature, 32, 64));
  const yParity = (() => {
    const yParity2 = Number(`0x${signature.slice(130)}`);
    if (Number.isNaN(yParity2))
      return;
    try {
      return vToYParity(yParity2);
    } catch {
      throw new InvalidYParityError({ value: yParity2 });
    }
  })();
  if (typeof yParity === "undefined")
    return {
      r,
      s
    };
  return {
    r,
    s,
    yParity
  };
}
function extract3(value) {
  if (typeof value.r === "undefined")
    return;
  if (typeof value.s === "undefined")
    return;
  return from11(value);
}
function from11(signature) {
  const signature_ = (() => {
    if (typeof signature === "string")
      return fromHex5(signature);
    if (signature instanceof Uint8Array)
      return fromBytes4(signature);
    if (typeof signature.r === "string")
      return fromRpc2(signature);
    if (signature.v)
      return fromLegacy(signature);
    return {
      r: signature.r,
      s: signature.s,
      ...typeof signature.yParity !== "undefined" ? { yParity: signature.yParity } : {}
    };
  })();
  assert6(signature_);
  return signature_;
}
function fromLegacy(signature) {
  return {
    r: signature.r,
    s: signature.s,
    yParity: vToYParity(signature.v)
  };
}
function fromRpc2(signature) {
  const yParity = (() => {
    const v = signature.v ? Number(signature.v) : undefined;
    let yParity2 = signature.yParity ? Number(signature.yParity) : undefined;
    if (typeof v === "number" && typeof yParity2 !== "number")
      yParity2 = vToYParity(v);
    if (typeof yParity2 !== "number")
      throw new InvalidYParityError({ value: signature.yParity });
    return yParity2;
  })();
  return {
    r: BigInt(signature.r),
    s: BigInt(signature.s),
    yParity
  };
}
function toTuple(signature) {
  const { r, s, yParity } = signature;
  return [
    yParity ? "0x01" : "0x",
    r === 0n ? "0x" : trimLeft2(fromNumber(r)),
    s === 0n ? "0x" : trimLeft2(fromNumber(s))
  ];
}
function vToYParity(v) {
  if (v === 0 || v === 27)
    return 0;
  if (v === 1 || v === 28)
    return 1;
  if (v >= 35)
    return v % 2 === 0 ? 1 : 0;
  throw new InvalidVError({ value: v });
}
class InvalidSerializedSizeError2 extends BaseError3 {
  constructor({ signature }) {
    super(`Value \`${signature}\` is an invalid signature size.`, {
      metaMessages: [
        "Expected: 64 bytes or 65 bytes.",
        `Received ${size4(from2(signature))} bytes.`
      ]
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidSerializedSizeError"
    });
  }
}

class MissingPropertiesError extends BaseError3 {
  constructor({ signature }) {
    super(`Signature \`${stringify2(signature)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.MissingPropertiesError"
    });
  }
}

class InvalidRError extends BaseError3 {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid r value. r must be a positive integer less than 2^256.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidRError"
    });
  }
}

class InvalidSError extends BaseError3 {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid s value. s must be a positive integer less than 2^256.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidSError"
    });
  }
}

class InvalidYParityError extends BaseError3 {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid y-parity value. Y-parity must be 0 or 1.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidYParityError"
    });
  }
}

class InvalidVError extends BaseError3 {
  constructor({ value }) {
    super(`Value \`${value}\` is an invalid v value. v must be 27, 28 or >=35.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "Signature.InvalidVError"
    });
  }
}

// node_modules/ox/_esm/core/Authorization.js
function from12(authorization, options = {}) {
  if (typeof authorization.chainId === "string")
    return fromRpc3(authorization);
  return { ...authorization, ...options.signature };
}
function fromRpc3(authorization) {
  const { address, chainId, nonce } = authorization;
  const signature = extract3(authorization);
  return {
    address,
    chainId: Number(chainId),
    nonce: BigInt(nonce),
    ...signature
  };
}
function getSignPayload(authorization) {
  return hash2(authorization, { presign: true });
}
function hash2(authorization, options = {}) {
  const { presign } = options;
  return keccak2563(concat2("0x05", fromHex4(toTuple2(presign ? {
    address: authorization.address,
    chainId: authorization.chainId,
    nonce: authorization.nonce
  } : authorization))));
}
function toTuple2(authorization) {
  const { address, chainId, nonce } = authorization;
  const signature = extract3(authorization);
  return [
    chainId ? fromNumber(chainId) : "0x",
    address,
    nonce ? fromNumber(nonce) : "0x",
    ...signature ? toTuple(signature) : []
  ];
}

// node_modules/ox/_esm/erc8010/SignatureErc8010.js
init_Errors();
init_Hex();

// node_modules/ox/_esm/core/Secp256k1.js
init_secp256k1();
init_Hex();
function recoverAddress3(options) {
  return fromPublicKey(recoverPublicKey3(options));
}
function recoverPublicKey3(options) {
  const { payload, signature } = options;
  const { r, s, yParity } = signature;
  const signature_ = new secp256k1.Signature(BigInt(r), BigInt(s)).addRecoveryBit(yParity);
  const point = signature_.recoverPublicKey(from2(payload).substring(2));
  return from3(point);
}

// node_modules/ox/_esm/erc8010/SignatureErc8010.js
var magicBytes2 = "0x8010801080108010801080108010801080108010801080108010801080108010";
var suffixParameters = from6("(uint256 chainId, address delegation, uint256 nonce, uint8 yParity, uint256 r, uint256 s), address to, bytes data");
function assert7(value) {
  if (typeof value === "string") {
    if (slice3(value, -32) !== magicBytes2)
      throw new InvalidWrappedSignatureError2(value);
  } else
    assert6(value.authorization);
}
function from13(value) {
  if (typeof value === "string")
    return unwrap2(value);
  return value;
}
function unwrap2(wrapped) {
  assert7(wrapped);
  const suffixLength = toNumber(slice3(wrapped, -64, -32));
  const suffix = slice3(wrapped, -suffixLength - 64, -64);
  const signature = slice3(wrapped, 0, -suffixLength - 64);
  const [auth, to, data] = decode(suffixParameters, suffix);
  const authorization = from12({
    address: auth.delegation,
    chainId: Number(auth.chainId),
    nonce: auth.nonce,
    yParity: auth.yParity,
    r: auth.r,
    s: auth.s
  });
  return {
    authorization,
    signature,
    ...data && data !== "0x" ? { data, to } : {}
  };
}
function wrap2(value) {
  const { data, signature } = value;
  assert7(value);
  const self2 = recoverAddress3({
    payload: getSignPayload(value.authorization),
    signature: from11(value.authorization)
  });
  const suffix = encode2(suffixParameters, [
    {
      ...value.authorization,
      delegation: value.authorization.address,
      chainId: BigInt(value.authorization.chainId)
    },
    value.to ?? self2,
    data ?? "0x"
  ]);
  const suffixLength = fromNumber(size4(suffix), { size: 32 });
  return concat2(signature, suffix, suffixLength, magicBytes2);
}
function validate5(value) {
  try {
    assert7(value);
    return true;
  } catch {
    return false;
  }
}

class InvalidWrappedSignatureError2 extends BaseError3 {
  constructor(wrapped) {
    super(`Value \`${wrapped}\` is an invalid ERC-8010 wrapped signature.`);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "SignatureErc8010.InvalidWrappedSignatureError"
    });
  }
}
// node_modules/viem/_esm/actions/public/verifyHash.js
init_abis();
init_contract();
init_encodeDeployData();
init_encodeFunctionData();
init_getAddress();
init_isAddressEqual();

// node_modules/viem/_esm/utils/authorization/verifyAuthorization.js
init_getAddress();
init_isAddressEqual();
async function verifyAuthorization2({ address, authorization, signature }) {
  return isAddressEqual(getAddress(address), await recoverAuthorizationAddress({
    authorization,
    signature
  }));
}

// node_modules/viem/_esm/actions/public/verifyHash.js
init_fromHex();
init_toHex();

// node_modules/viem/_esm/utils/signature/serializeSignature.js
init_secp256k1();
init_fromHex();
init_toBytes();
function serializeSignature({ r, s, to = "hex", v, yParity }) {
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1)
      return yParity;
    if (v && (v === 27n || v === 28n || v >= 35n))
      return v % 2n === 0n ? 1 : 0;
    throw new Error("Invalid `v` or `yParity` value");
  })();
  const signature = `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
  if (to === "hex")
    return signature;
  return hexToBytes(signature);
}

// node_modules/viem/_esm/actions/public/verifyHash.js
init_call();
async function verifyHash2(client, parameters) {
  const { address, chain = client.chain, hash: hash3, erc6492VerifierAddress: verifierAddress = parameters.universalSignatureVerifierAddress ?? chain?.contracts?.erc6492Verifier?.address, multicallAddress = parameters.multicallAddress ?? chain?.contracts?.multicall3?.address, mode = "auto" } = parameters;
  if (chain?.verifyHash)
    return await chain.verifyHash(client, parameters);
  const signature = (() => {
    const signature2 = parameters.signature;
    if (isHex(signature2))
      return signature2;
    if (typeof signature2 === "object" && "r" in signature2 && "s" in signature2)
      return serializeSignature(signature2);
    return bytesToHex(signature2);
  })();
  try {
    if (mode === "eoa") {
      try {
        const verified = isAddressEqual(getAddress(address), await recoverAddress({ hash: hash3, signature }));
        if (verified)
          return true;
      } catch {}
    }
    if (exports_SignatureErc8010.validate(signature))
      return await verifyErc8010(client, {
        ...parameters,
        multicallAddress,
        signature
      });
    return await verifyErc6492(client, {
      ...parameters,
      verifierAddress,
      signature
    });
  } catch (error) {
    if (mode !== "eoa") {
      try {
        const verified = isAddressEqual(getAddress(address), await recoverAddress({ hash: hash3, signature }));
        if (verified)
          return true;
      } catch {}
    }
    if (error instanceof VerificationError) {
      return false;
    }
    throw error;
  }
}
async function verifyErc8010(client, parameters) {
  const { address, blockHash, blockNumber, blockTag, hash: hash3, multicallAddress, requireCanonical } = parameters;
  const { authorization: authorization_ox, data: initData, signature, to } = exports_SignatureErc8010.unwrap(parameters.signature);
  const code = await getCode(client, {
    address,
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  if (code === concatHex(["0xef0100", authorization_ox.address]))
    return await verifyErc1271(client, {
      ...parameters,
      signature
    });
  const authorization = {
    address: authorization_ox.address,
    chainId: Number(authorization_ox.chainId),
    nonce: Number(authorization_ox.nonce),
    r: numberToHex(authorization_ox.r, { size: 32 }),
    s: numberToHex(authorization_ox.s, { size: 32 }),
    yParity: authorization_ox.yParity
  };
  const valid = await verifyAuthorization2({
    address,
    authorization
  });
  if (!valid)
    throw new VerificationError;
  const results = await getAction(client, readContract, "readContract")({
    ...multicallAddress ? { address: multicallAddress } : { code: multicall3Bytecode },
    authorizationList: [authorization],
    abi: multicall3Abi,
    blockHash,
    blockNumber,
    blockTag: "pending",
    functionName: "aggregate3",
    requireCanonical,
    args: [
      [
        ...initData ? [
          {
            allowFailure: true,
            target: to ?? address,
            callData: initData
          }
        ] : [],
        {
          allowFailure: true,
          target: address,
          callData: encodeFunctionData({
            abi: erc1271Abi,
            functionName: "isValidSignature",
            args: [hash3, signature]
          })
        }
      ]
    ]
  });
  const data = results[results.length - 1]?.returnData;
  if (data?.startsWith("0x1626ba7e"))
    return true;
  throw new VerificationError;
}
async function verifyErc6492(client, parameters) {
  const { address, factory, factoryData, hash: hash3, signature, verifierAddress, ...rest } = parameters;
  const wrappedSignature = await (async () => {
    if (!factory && !factoryData)
      return signature;
    if (exports_SignatureErc6492.validate(signature))
      return signature;
    return exports_SignatureErc6492.wrap({
      data: factoryData,
      signature,
      to: factory
    });
  })();
  const args = verifierAddress ? {
    to: verifierAddress,
    data: encodeFunctionData({
      abi: erc6492SignatureValidatorAbi,
      functionName: "isValidSig",
      args: [address, hash3, wrappedSignature]
    }),
    ...rest
  } : {
    data: encodeDeployData({
      abi: erc6492SignatureValidatorAbi,
      args: [address, hash3, wrappedSignature],
      bytecode: erc6492SignatureValidatorByteCode
    }),
    ...rest
  };
  const { data } = await getAction(client, call, "call")(args).catch((error) => {
    if (error instanceof CallExecutionError)
      throw new VerificationError;
    throw error;
  });
  if (hexToBool(data ?? "0x0"))
    return true;
  throw new VerificationError;
}
async function verifyErc1271(client, parameters) {
  const { address, blockHash, blockNumber, blockTag, hash: hash3, requireCanonical, signature } = parameters;
  const result = await getAction(client, readContract, "readContract")({
    address,
    abi: erc1271Abi,
    args: [hash3, signature],
    blockHash,
    blockNumber,
    blockTag,
    functionName: "isValidSignature",
    requireCanonical
  }).catch((error) => {
    if (error instanceof ContractFunctionExecutionError)
      throw new VerificationError;
    throw error;
  });
  if (result.startsWith("0x1626ba7e"))
    return true;
  throw new VerificationError;
}

class VerificationError extends Error {
}

// node_modules/viem/_esm/utils/signature/hashMessage.js
init_keccak256();

// node_modules/viem/_esm/constants/strings.js
var presignMessagePrefix = `\x19Ethereum Signed Message:
`;

// node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
init_size();
init_toHex();
function toPrefixedMessage(message_) {
  const message = (() => {
    if (typeof message_ === "string")
      return stringToHex(message_);
    if (typeof message_.raw === "string")
      return message_.raw;
    return bytesToHex(message_.raw);
  })();
  const prefix = stringToHex(`${presignMessagePrefix}${size2(message)}`);
  return concat([prefix, message]);
}

// node_modules/viem/_esm/utils/signature/hashMessage.js
function hashMessage2(message, to_) {
  return keccak256(toPrefixedMessage(message), to_);
}

// node_modules/viem/_esm/actions/public/verifyMessage.js
async function verifyMessage2(client, { address, message, factory, factoryData, signature, ...callRequest }) {
  const hash3 = hashMessage2(message);
  return getAction(client, verifyHash2, "verifyHash")({
    address,
    factory,
    factoryData,
    hash: hash3,
    signature,
    ...callRequest
  });
}

// node_modules/viem/_esm/utils/signature/hashTypedData.js
init_encodeAbiParameters();
init_toHex();
init_keccak256();

// node_modules/viem/_esm/utils/typedData.js
init_abi();
init_address();

// node_modules/viem/_esm/errors/typedData.js
init_base();

class InvalidDomainError extends BaseError {
  constructor({ domain }) {
    super(`Invalid domain "${stringify(domain)}".`, {
      metaMessages: ["Must be a valid EIP-712 domain."]
    });
  }
}

class InvalidPrimaryTypeError extends BaseError {
  constructor({ primaryType, types }) {
    super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
      docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
      metaMessages: ["Check that the primary type is a key in `types`."]
    });
  }
}

class InvalidStructTypeError extends BaseError {
  constructor({ type }) {
    super(`Struct type "${type}" is invalid.`, {
      metaMessages: ["Struct type must not be a Solidity type."],
      name: "InvalidStructTypeError"
    });
  }
}

// node_modules/viem/_esm/utils/typedData.js
init_isAddress();
init_size();
init_toHex();
init_regex();
function validateTypedData2(parameters) {
  const { domain, message, primaryType, types } = parameters;
  const validateData = (struct, data) => {
    for (const param of struct) {
      const { name, type } = param;
      const value = data[name];
      const integerMatch = type.match(integerRegex);
      if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
        const [_type, base, size_] = integerMatch;
        numberToHex(value, {
          signed: base === "int",
          size: Number.parseInt(size_, 10) / 8
        });
      }
      if (type === "address" && typeof value === "string" && !isAddress(value))
        throw new InvalidAddressError({ address: value });
      const bytesMatch = type.match(bytesRegex);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size2(value) !== Number.parseInt(size_, 10))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size_, 10),
            givenSize: size2(value)
          });
      }
      const struct2 = types[type];
      if (struct2) {
        validateReference(type);
        validateData(struct2, value);
      }
    }
  };
  if (types.EIP712Domain && domain) {
    if (typeof domain !== "object")
      throw new InvalidDomainError({ domain });
    validateData(types.EIP712Domain, domain);
  }
  if (primaryType !== "EIP712Domain") {
    if (types[primaryType])
      validateData(types[primaryType], message);
    else
      throw new InvalidPrimaryTypeError({ primaryType, types });
  }
}
function getTypesForEIP712Domain({ domain }) {
  return [
    typeof domain?.name === "string" && { name: "name", type: "string" },
    domain?.version && { name: "version", type: "string" },
    (typeof domain?.chainId === "number" || typeof domain?.chainId === "bigint") && {
      name: "chainId",
      type: "uint256"
    },
    domain?.verifyingContract && {
      name: "verifyingContract",
      type: "address"
    },
    domain?.salt && { name: "salt", type: "bytes32" }
  ].filter(Boolean);
}
function validateReference(type) {
  if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int"))
    throw new InvalidStructTypeError({ type });
}

// node_modules/viem/_esm/utils/signature/hashTypedData.js
function hashTypedData2(parameters) {
  const { domain = {}, message, primaryType } = parameters;
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData2({
    domain,
    message,
    primaryType,
    types
  });
  const parts = ["0x1901"];
  if (domain)
    parts.push(hashDomain({
      domain,
      types
    }));
  if (primaryType !== "EIP712Domain")
    parts.push(hashStruct2({
      data: message,
      primaryType,
      types
    }));
  return keccak256(concat(parts));
}
function hashDomain({ domain, types }) {
  return hashStruct2({
    data: domain,
    primaryType: "EIP712Domain",
    types
  });
}
function hashStruct2({ data, primaryType, types }) {
  const encoded = encodeData2({
    data,
    primaryType,
    types
  });
  return keccak256(encoded);
}
function encodeData2({ data, primaryType, types }) {
  const encodedTypes = [{ type: "bytes32" }];
  const encodedValues = [hashType({ primaryType, types })];
  for (const field of types[primaryType]) {
    const [type, value] = encodeField({
      types,
      name: field.name,
      type: field.type,
      value: data[field.name]
    });
    encodedTypes.push(type);
    encodedValues.push(value);
  }
  return encodeAbiParameters(encodedTypes, encodedValues);
}
function hashType({ primaryType, types }) {
  const encodedHashType = toHex(encodeType({ primaryType, types }));
  return keccak256(encodedHashType);
}
function encodeType({ primaryType, types }) {
  let result = "";
  const unsortedDeps = findTypeDependencies({ primaryType, types });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
function findTypeDependencies({ primaryType: primaryType_, types }, results = new Set) {
  const match2 = primaryType_.match(/^\w*/u);
  const primaryType = match2?.[0];
  if (results.has(primaryType) || types[primaryType] === undefined) {
    return results;
  }
  results.add(primaryType);
  for (const field of types[primaryType]) {
    findTypeDependencies({ primaryType: field.type, types }, results);
  }
  return results;
}
function encodeField({ types, name, type, value }) {
  if (types[type] !== undefined) {
    return [
      { type: "bytes32" },
      keccak256(encodeData2({ data: value, primaryType: type, types }))
    ];
  }
  if (type === "bytes")
    return [{ type: "bytes32" }, keccak256(value)];
  if (type === "string")
    return [{ type: "bytes32" }, keccak256(toHex(value))];
  if (type.lastIndexOf("]") === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf("["));
    const typeValuePairs = value.map((item) => encodeField({
      name,
      type: parsedType,
      types,
      value: item
    }));
    return [
      { type: "bytes32" },
      keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
    ];
  }
  return [{ type }, value];
}

// node_modules/viem/_esm/actions/public/verifyTypedData.js
async function verifyTypedData2(client, parameters) {
  const { address, factory, factoryData, signature, message, primaryType, types, domain, ...callRequest } = parameters;
  const hash3 = hashTypedData2({ message, primaryType, types, domain });
  return getAction(client, verifyHash2, "verifyHash")({
    address,
    factory,
    factoryData,
    hash: hash3,
    signature,
    ...callRequest
  });
}

// node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
init_transaction();

// node_modules/viem/_esm/utils/observe.js
var listenersCache = /* @__PURE__ */ new Map;
var cleanupCache = /* @__PURE__ */ new Map;
var callbackCount = 0;
function observe(observerId, callbacks, fn) {
  const callbackId = ++callbackCount;
  const getListeners = () => listenersCache.get(observerId) || [];
  const unsubscribe = () => {
    const listeners2 = getListeners();
    const nextListeners = listeners2.filter((cb) => cb.id !== callbackId);
    if (nextListeners.length === 0) {
      listenersCache.delete(observerId);
      cleanupCache.delete(observerId);
      return;
    }
    listenersCache.set(observerId, nextListeners);
  };
  const unwatch = () => {
    const listeners2 = getListeners();
    if (!listeners2.some((cb) => cb.id === callbackId))
      return;
    const cleanup2 = cleanupCache.get(observerId);
    if (listeners2.length === 1 && cleanup2) {
      const p = cleanup2();
      if (p instanceof Promise)
        p.catch(() => {});
    }
    unsubscribe();
  };
  const listeners = getListeners();
  listenersCache.set(observerId, [
    ...listeners,
    { id: callbackId, fns: callbacks }
  ]);
  if (listeners && listeners.length > 0)
    return unwatch;
  const emit = {};
  for (const key in callbacks) {
    emit[key] = (...args) => {
      const listeners2 = getListeners();
      if (listeners2.length === 0)
        return;
      for (const listener of listeners2)
        listener.fns[key]?.(...args);
    };
  }
  const cleanup = fn(emit);
  if (typeof cleanup === "function")
    cleanupCache.set(observerId, cleanup);
  return unwatch;
}
// node_modules/viem/_esm/utils/wait.js
async function wait(time, { signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(getAbortError(signal));
      return;
    }
    const cleanup = () => signal?.removeEventListener("abort", onAbort);
    const timeout = setTimeout(() => {
      cleanup();
      resolve();
    }, time);
    const onAbort = () => {
      clearTimeout(timeout);
      cleanup();
      reject(getAbortError(signal));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

// node_modules/viem/_esm/utils/promise/withRetry.js
function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry = () => true, signal } = {}) {
  return new Promise((resolve, reject) => {
    const attemptRetry = async ({ count = 0 } = {}) => {
      if (signal?.aborted) {
        reject(getAbortError(signal));
        return;
      }
      const retry = async ({ error }) => {
        const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
        if (delay) {
          try {
            await wait(delay, { signal });
          } catch (err) {
            reject(err);
            return;
          }
        }
        attemptRetry({ count: count + 1 });
      };
      try {
        const data = await fn();
        resolve(data);
      } catch (err) {
        if (signal?.aborted) {
          reject(getAbortError(signal));
          return;
        }
        if (isAbortError(err)) {
          reject(err);
          return;
        }
        if (count < retryCount && await shouldRetry({ count, error: err }))
          return retry({ error: err });
        reject(err);
      }
    };
    attemptRetry();
  });
}
// node_modules/viem/_esm/actions/public/watchBlockNumber.js
init_fromHex();

// node_modules/viem/_esm/utils/poll.js
function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
  let active = true;
  const unwatch = () => active = false;
  const watch = async () => {
    let data;
    if (emitOnBegin)
      data = await fn({ unpoll: unwatch });
    const initialWait = await initialWaitTime?.(data) ?? interval;
    await wait(initialWait);
    const poll2 = async () => {
      if (!active)
        return;
      await fn({ unpoll: unwatch });
      await wait(interval);
      poll2();
    };
    poll2();
  };
  watch();
  return unwatch;
}
// node_modules/viem/_esm/actions/public/watchBlockNumber.js
function watchBlockNumber(client, { emitOnBegin = false, emitMissed = false, onBlockNumber, onError, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  let prevBlockNumber;
  const pollBlockNumber = () => {
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed,
      pollingInterval
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => poll(async () => {
      try {
        const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({ cacheTime: 0 });
        if (prevBlockNumber !== undefined) {
          if (blockNumber === prevBlockNumber)
            return;
          if (blockNumber - prevBlockNumber > 1 && emitMissed) {
            for (let i = prevBlockNumber + 1n;i < blockNumber; i++) {
              emit.onBlockNumber(i, prevBlockNumber);
              prevBlockNumber = i;
            }
          }
        }
        if (prevBlockNumber === undefined || blockNumber > prevBlockNumber) {
          emit.onBlockNumber(blockNumber, prevBlockNumber);
          prevBlockNumber = blockNumber;
        }
      } catch (err) {
        emit.onError?.(err);
      }
    }, {
      emitOnBegin,
      interval: pollingInterval
    }));
  };
  const subscribeBlockNumber = () => {
    const observerId = stringify([
      "watchBlockNumber",
      client.uid,
      emitOnBegin,
      emitMissed
    ]);
    return observe(observerId, { onBlockNumber, onError }, (emit) => {
      let active = true;
      let unsubscribe = () => active = false;
      (async () => {
        try {
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
              if (!transport2)
                return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["newHeads"],
            onData(data) {
              if (!active)
                return;
              const blockNumber = hexToBigInt(data.result?.number);
              emit.onBlockNumber(blockNumber, prevBlockNumber);
              prevBlockNumber = blockNumber;
            },
            onError(error) {
              emit.onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    });
  };
  return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
}

// node_modules/viem/_esm/actions/public/waitForTransactionReceipt.js
async function waitForTransactionReceipt(client, parameters) {
  const {
    checkReplacement = client.chain?.supportsTransactionReplacementDetection ?? true,
    confirmations = 1,
    hash: hash3,
    onReplaced,
    retryCount = 6,
    retryDelay = ({ count }) => ~~(1 << count) * 200,
    timeout = 180000
  } = parameters;
  const observerId = stringify(["waitForTransactionReceipt", client.uid, hash3]);
  const pollingInterval = (() => {
    if (parameters.pollingInterval)
      return parameters.pollingInterval;
    if (client.chain?.experimental_preconfirmationTime)
      return client.chain.experimental_preconfirmationTime;
    return client.pollingInterval;
  })();
  let transaction;
  let replacedTransaction;
  let receipt;
  let retrying = false;
  let _unobserve;
  let _unwatch;
  const { promise, resolve, reject } = withResolvers();
  const timer = timeout ? setTimeout(() => {
    _unwatch?.();
    _unobserve?.();
    reject(new WaitForTransactionReceiptTimeoutError({ hash: hash3 }));
  }, timeout) : undefined;
  _unobserve = observe(observerId, { onReplaced, resolve, reject }, async (emit) => {
    receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash: hash3 }).catch(() => {
      return;
    });
    if (receipt && confirmations <= 1) {
      clearTimeout(timer);
      emit.resolve(receipt);
      _unobserve?.();
      return;
    }
    _unwatch = getAction(client, watchBlockNumber, "watchBlockNumber")({
      emitMissed: true,
      emitOnBegin: true,
      poll: true,
      pollingInterval,
      async onBlockNumber(blockNumber_) {
        const done = (fn) => {
          clearTimeout(timer);
          _unwatch?.();
          fn();
          _unobserve?.();
        };
        let blockNumber = blockNumber_;
        if (retrying)
          return;
        try {
          if (receipt) {
            if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
              return;
            done(() => emit.resolve(receipt));
            return;
          }
          if (checkReplacement && !transaction) {
            retrying = true;
            await withRetry(async () => {
              transaction = await getAction(client, getTransaction, "getTransaction")({ hash: hash3 });
              if (transaction.blockNumber)
                blockNumber = transaction.blockNumber;
            }, {
              delay: retryDelay,
              retryCount
            });
            retrying = false;
          }
          receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({ hash: hash3 });
          if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
            return;
          done(() => emit.resolve(receipt));
        } catch (err) {
          if (err instanceof TransactionNotFoundError || err instanceof TransactionReceiptNotFoundError) {
            if (!transaction) {
              retrying = false;
              return;
            }
            try {
              replacedTransaction = transaction;
              retrying = true;
              const block = await withRetry(() => getAction(client, getBlock, "getBlock")({
                blockNumber,
                includeTransactions: true
              }), {
                delay: retryDelay,
                retryCount,
                shouldRetry: ({ error }) => error instanceof BlockNotFoundError
              });
              retrying = false;
              const replacementTransaction = block.transactions.find(({ from: from14, nonce }) => from14 === replacedTransaction.from && nonce === replacedTransaction.nonce);
              if (!replacementTransaction)
                return;
              receipt = await getAction(client, getTransactionReceipt, "getTransactionReceipt")({
                hash: replacementTransaction.hash
              });
              if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                return;
              let reason = "replaced";
              if (replacementTransaction.to === replacedTransaction.to && replacementTransaction.value === replacedTransaction.value && replacementTransaction.input === replacedTransaction.input) {
                reason = "repriced";
              } else if (replacementTransaction.from === replacementTransaction.to && replacementTransaction.value === 0n) {
                reason = "cancelled";
              }
              done(() => {
                emit.onReplaced?.({
                  reason,
                  replacedTransaction,
                  transaction: replacementTransaction,
                  transactionReceipt: receipt
                });
                emit.resolve(receipt);
              });
            } catch (err_) {
              done(() => emit.reject(err_));
            }
          } else {
            done(() => emit.reject(err));
          }
        }
      }
    });
  });
  return promise;
}
// node_modules/viem/_esm/actions/public/watchBlocks.js
function watchBlocks(client, { blockTag = client.experimental_blockTag ?? "latest", emitMissed = false, emitOnBegin = false, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  const includeTransactions = includeTransactions_ ?? false;
  let prevBlock;
  const pollBlocks = () => {
    const observerId = stringify([
      "watchBlocks",
      client.uid,
      blockTag,
      emitMissed,
      emitOnBegin,
      includeTransactions,
      pollingInterval
    ]);
    return observe(observerId, { onBlock, onError }, (emit) => poll(async () => {
      try {
        const block = await getAction(client, getBlock, "getBlock")({
          blockTag,
          includeTransactions
        });
        if (block.number !== null && prevBlock?.number != null) {
          if (block.number === prevBlock.number)
            return;
          if (block.number - prevBlock.number > 1 && emitMissed) {
            for (let i = prevBlock?.number + 1n;i < block.number; i++) {
              const block2 = await getAction(client, getBlock, "getBlock")({
                blockNumber: i,
                includeTransactions
              });
              emit.onBlock(block2, prevBlock);
              prevBlock = block2;
            }
          }
        }
        if (prevBlock?.number == null || blockTag === "pending" && block?.number == null || block.number !== null && block.number > prevBlock.number) {
          emit.onBlock(block, prevBlock);
          prevBlock = block;
        }
      } catch (err) {
        emit.onError?.(err);
      }
    }, {
      emitOnBegin,
      interval: pollingInterval
    }));
  };
  const subscribeBlocks = () => {
    let active = true;
    let emitFetched = true;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        if (emitOnBegin) {
          getAction(client, getBlock, "getBlock")({
            blockTag,
            includeTransactions
          }).then((block) => {
            if (!active)
              return;
            if (!emitFetched)
              return;
            onBlock(block, undefined);
            emitFetched = false;
          }).catch(onError);
        }
        const transport = (() => {
          if (client.transport.type === "fallback") {
            const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
            if (!transport2)
              return client.transport;
            return transport2.value;
          }
          return client.transport;
        })();
        const { unsubscribe: unsubscribe_ } = await transport.subscribe({
          params: ["newHeads"],
          async onData(data) {
            if (!active)
              return;
            const block = await getAction(client, getBlock, "getBlock")({
              blockNumber: data.result?.number,
              includeTransactions
            }).catch(() => {});
            if (!active)
              return;
            onBlock(block, prevBlock);
            emitFetched = false;
            prevBlock = block;
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  };
  return enablePolling ? pollBlocks() : subscribeBlocks();
}

// node_modules/viem/_esm/actions/public/watchContractEvent.js
init_abi();
init_rpc();
function watchContractEvent(client, parameters) {
  const { abi: abi2, address, args, batch = true, eventName, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ } = parameters;
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (typeof fromBlock === "bigint")
      return true;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  const pollContractEvent = () => {
    const strict = strict_ ?? false;
    const observerId = stringify([
      "watchContractEvent",
      address,
      args,
      batch,
      client.uid,
      eventName,
      pollingInterval,
      strict,
      fromBlock
    ]);
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== undefined)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        if (!initialized) {
          try {
            filter = await getAction(client, createContractEventFilter, "createContractEventFilter")({
              abi: abi2,
              address,
              args,
              eventName,
              strict,
              fromBlock
            });
          } catch {}
          initialized = true;
          return;
        }
        try {
          let logs;
          if (filter) {
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber < blockNumber) {
              logs = await getAction(client, getContractEvents, "getContractEvents")({
                abi: abi2,
                address,
                args,
                eventName,
                fromBlock: previousBlockNumber + 1n,
                toBlock: blockNumber,
                strict
              });
            } else {
              logs = [];
            }
            previousBlockNumber = blockNumber;
          }
          if (logs.length === 0)
            return;
          if (batch)
            emit.onLogs(logs);
          else
            for (const log of logs)
              emit.onLogs([log]);
        } catch (err) {
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribeContractEvent = () => {
    const strict = strict_ ?? false;
    const observerId = stringify([
      "watchContractEvent",
      address,
      args,
      batch,
      client.uid,
      eventName,
      pollingInterval,
      strict
    ]);
    let active = true;
    let unsubscribe = () => active = false;
    return observe(observerId, { onLogs, onError }, (emit) => {
      (async () => {
        try {
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
              if (!transport2)
                return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const topics = eventName ? encodeEventTopics({
            abi: abi2,
            eventName,
            args
          }) : [];
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["logs", { address, topics }],
            onData(data) {
              if (!active)
                return;
              const log = data.result;
              try {
                const { eventName: eventName2, args: args2 } = decodeEventLog({
                  abi: abi2,
                  data: log.data,
                  topics: log.topics,
                  strict: strict_
                });
                const formatted = formatLog(log, {
                  args: args2,
                  eventName: eventName2
                });
                emit.onLogs([formatted]);
              } catch (err) {
                let eventName2;
                let isUnnamed;
                if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                  if (strict_)
                    return;
                  eventName2 = err.abiItem.name;
                  isUnnamed = err.abiItem.inputs?.some((x) => !(("name" in x) && x.name));
                }
                const formatted = formatLog(log, {
                  args: isUnnamed ? [] : {},
                  eventName: eventName2
                });
                emit.onLogs([formatted]);
              }
            },
            onError(error) {
              emit.onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active)
            unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    });
  };
  return enablePolling ? pollContractEvent() : subscribeContractEvent();
}

// node_modules/viem/_esm/actions/public/watchEvent.js
init_abi();
init_rpc();
function watchEvent(client, { address, args, batch = true, event, events, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_ }) {
  const enablePolling = (() => {
    if (typeof poll_ !== "undefined")
      return poll_;
    if (typeof fromBlock === "bigint")
      return true;
    if (client.transport.type === "webSocket" || client.transport.type === "ipc")
      return false;
    if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
      return false;
    return true;
  })();
  const strict = strict_ ?? false;
  const pollEvent = () => {
    const observerId = stringify([
      "watchEvent",
      address,
      args,
      batch,
      client.uid,
      event,
      pollingInterval,
      fromBlock
    ]);
    return observe(observerId, { onLogs, onError }, (emit) => {
      let previousBlockNumber;
      if (fromBlock !== undefined)
        previousBlockNumber = fromBlock - 1n;
      let filter;
      let initialized = false;
      const unwatch = poll(async () => {
        if (!initialized) {
          try {
            filter = await getAction(client, createEventFilter, "createEventFilter")({
              address,
              args,
              event,
              events,
              strict,
              fromBlock
            });
          } catch {}
          initialized = true;
          return;
        }
        try {
          let logs;
          if (filter) {
            logs = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          } else {
            const blockNumber = await getAction(client, getBlockNumber, "getBlockNumber")({});
            if (previousBlockNumber && previousBlockNumber !== blockNumber) {
              logs = await getAction(client, getLogs, "getLogs")({
                address,
                args,
                event,
                events,
                fromBlock: previousBlockNumber + 1n,
                toBlock: blockNumber
              });
            } else {
              logs = [];
            }
            previousBlockNumber = blockNumber;
          }
          if (logs.length === 0)
            return;
          if (batch)
            emit.onLogs(logs);
          else
            for (const log of logs)
              emit.onLogs([log]);
        } catch (err) {
          if (filter && err instanceof InvalidInputRpcError)
            initialized = false;
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribeEvent = () => {
    let active = true;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        const transport = (() => {
          if (client.transport.type === "fallback") {
            const transport2 = client.transport.transports.find((transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc");
            if (!transport2)
              return client.transport;
            return transport2.value;
          }
          return client.transport;
        })();
        const events_ = events ?? (event ? [event] : undefined);
        let topics = [];
        if (events_) {
          const encoded = events_.flatMap((event2) => encodeEventTopics({
            abi: [event2],
            eventName: event2.name,
            args
          }));
          topics = [encoded];
          if (event)
            topics = topics[0];
        }
        const { unsubscribe: unsubscribe_ } = await transport.subscribe({
          params: ["logs", { address, topics }],
          onData(data) {
            if (!active)
              return;
            const log = data.result;
            try {
              const { eventName, args: args2 } = decodeEventLog({
                abi: events_ ?? [],
                data: log.data,
                topics: log.topics,
                strict
              });
              const formatted = formatLog(log, { args: args2, eventName });
              onLogs([formatted]);
            } catch (err) {
              let eventName;
              let isUnnamed;
              if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                if (strict_)
                  return;
                eventName = err.abiItem.name;
                isUnnamed = err.abiItem.inputs?.some((x) => !(("name" in x) && x.name));
              }
              const formatted = formatLog(log, {
                args: isUnnamed ? [] : {},
                eventName
              });
              onLogs([formatted]);
            }
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  };
  return enablePolling ? pollEvent() : subscribeEvent();
}
// node_modules/viem/_esm/actions/public/watchPendingTransactions.js
function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval }) {
  const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket" && client.transport.type !== "ipc";
  const pollPendingTransactions = () => {
    const observerId = stringify([
      "watchPendingTransactions",
      client.uid,
      batch,
      pollingInterval
    ]);
    return observe(observerId, { onTransactions, onError }, (emit) => {
      let filter;
      const unwatch = poll(async () => {
        try {
          if (!filter) {
            try {
              filter = await getAction(client, createPendingTransactionFilter, "createPendingTransactionFilter")({});
              return;
            } catch (err) {
              unwatch();
              throw err;
            }
          }
          const hashes = await getAction(client, getFilterChanges, "getFilterChanges")({ filter });
          if (hashes.length === 0)
            return;
          if (batch)
            emit.onTransactions(hashes);
          else
            for (const hash3 of hashes)
              emit.onTransactions([hash3]);
        } catch (err) {
          emit.onError?.(err);
        }
      }, {
        emitOnBegin: true,
        interval: pollingInterval
      });
      return async () => {
        if (filter)
          await getAction(client, uninstallFilter, "uninstallFilter")({ filter });
        unwatch();
      };
    });
  };
  const subscribePendingTransactions = () => {
    let active = true;
    let unsubscribe = () => active = false;
    (async () => {
      try {
        const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
          params: ["newPendingTransactions"],
          onData(data) {
            if (!active)
              return;
            const transaction = data.result;
            onTransactions([transaction]);
          },
          onError(error) {
            onError?.(error);
          }
        });
        unsubscribe = unsubscribe_;
        if (!active)
          unsubscribe();
      } catch (err) {
        onError?.(err);
      }
    })();
    return () => unsubscribe();
  };
  return enablePolling ? pollPendingTransactions() : subscribePendingTransactions();
}

// node_modules/viem/_esm/utils/siwe/parseSiweMessage.js
function parseSiweMessage(message) {
  const { scheme, statement, ...prefix } = message.match(prefixRegex)?.groups ?? {};
  const { chainId, expirationTime, issuedAt, notBefore, requestId, ...suffix } = message.match(suffixRegex)?.groups ?? {};
  const resources = message.split("Resources:")[1]?.split(`
- `).slice(1);
  return {
    ...prefix,
    ...suffix,
    ...chainId ? { chainId: Number(chainId) } : {},
    ...expirationTime ? { expirationTime: new Date(expirationTime) } : {},
    ...issuedAt ? { issuedAt: new Date(issuedAt) } : {},
    ...notBefore ? { notBefore: new Date(notBefore) } : {},
    ...requestId ? { requestId } : {},
    ...resources ? { resources } : {},
    ...scheme ? { scheme } : {},
    ...statement ? { statement } : {}
  };
}
var prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
var suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;

// node_modules/viem/_esm/utils/siwe/validateSiweMessage.js
init_isAddress();
init_isAddressEqual();
function validateSiweMessage(parameters) {
  const { address, domain, message, nonce, scheme, time = new Date } = parameters;
  if (domain && message.domain !== domain)
    return false;
  if (nonce && message.nonce !== nonce)
    return false;
  if (scheme && message.scheme !== scheme)
    return false;
  if (message.expirationTime && time >= message.expirationTime)
    return false;
  if (message.notBefore && time < message.notBefore)
    return false;
  try {
    if (!message.address)
      return false;
    if (!isAddress(message.address, { strict: false }))
      return false;
    if (address && !isAddressEqual(message.address, address))
      return false;
  } catch {
    return false;
  }
  return true;
}

// node_modules/viem/_esm/actions/siwe/verifySiweMessage.js
async function verifySiweMessage(client, parameters) {
  const { address, domain, message, nonce, scheme, signature, time = new Date, ...callRequest } = parameters;
  const parsed = parseSiweMessage(message);
  if (!parsed.address)
    return false;
  const isValid = validateSiweMessage({
    address,
    domain,
    message: parsed,
    nonce,
    scheme,
    time
  });
  if (!isValid)
    return false;
  const hash3 = hashMessage2(message);
  return verifyHash2(client, {
    address: parsed.address,
    hash: hash3,
    signature,
    ...callRequest
  });
}
// node_modules/viem/_esm/actions/token/getAllowance.js
init_abis();

// node_modules/viem/_esm/actions/token/internal.js
init_abis();
init_isAddress();
init_isAddressEqual();

// node_modules/viem/_esm/utils/unit/formatUnits.js
init_Value();
function formatUnits2(value, decimals) {
  return format(value, decimals);
}

// node_modules/viem/_esm/actions/token/internal.js
function toAmount(amount, decimals) {
  return { amount, decimals, formatted: formatUnits2(amount, decimals) };
}
function resolveToken(client, parameters) {
  const { decimals, token } = parameters;
  const declared = findDeclaredToken(client, token);
  if (declared)
    return {
      address: declared.address,
      decimals: decimals ?? declared.decimals
    };
  if (isAddress(token, { strict: false }))
    return {
      address: token,
      decimals: decimals ?? inferDecimals(client, token)
    };
  throw new Error(`Token "${token}" is not a declared ERC-20 token on the client's \`tokens\` array (with an address for the client's chain), and is not a valid address.`);
}
function findDeclaredToken(client, token) {
  const tokens = client.tokens;
  const chainId = client.chain?.id;
  if (!tokens || chainId === undefined)
    return;
  const bySymbol = findTokenBySymbol(tokens, token);
  if (bySymbol)
    return resolveTokenForChain(bySymbol, chainId);
  if (isAddress(token, { strict: false }))
    for (const token_ of tokens) {
      const resolved = resolveTokenForChain(token_, chainId);
      if (resolved && isAddressEqual(resolved.address, token))
        return resolved;
    }
  return;
}
function resolveTokenForChain(token, chainId) {
  const address = token.addresses[chainId];
  if (!address)
    return;
  return {
    address,
    currency: token.currency,
    decimals: token.decimals,
    name: token.name,
    popular: token.popular,
    symbol: token.symbol
  };
}
function findTokenBySymbol(tokens, symbol) {
  const lowerSymbol = symbol.toLowerCase();
  for (const token of tokens) {
    if (token.symbol?.toLowerCase() === lowerSymbol)
      return token;
  }
  return;
}
function inferDecimals(client, address) {
  const tokens = client.tokens;
  const chainId = client.chain?.id;
  if (tokens && chainId !== undefined)
    for (const token of tokens) {
      const resolved = resolveTokenForChain(token, chainId);
      if (resolved && isAddressEqual(resolved.address, address))
        return resolved.decimals;
    }
  return;
}
async function resolveTokenWithDecimals(client, parameters) {
  const { address, decimals } = resolveToken(client, parameters);
  if (decimals !== undefined)
    return { address, decimals };
  return {
    address,
    decimals: await readContract(client, {
      abi: erc20Abi,
      address,
      functionName: "decimals"
    })
  };
}
function defineCall(call2) {
  return {
    ...call2,
    data: encodeFunctionData(call2),
    to: call2.address
  };
}

// node_modules/viem/_esm/actions/token/getAllowance.js
async function getAllowance(client, parameters) {
  const { account, decimals, spender, token, ...rest } = parameters;
  const [amount, { decimals: resolved }] = await Promise.all([
    readContract(client, {
      ...rest,
      ...getAllowance.call(client, { account, spender, token })
    }),
    resolveTokenWithDecimals(client, {
      decimals,
      token
    })
  ]);
  return toAmount(amount, resolved);
}
(function(getAllowance2) {
  function call2(client, args) {
    return defineCall({
      address: resolveToken(client, args).address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [args.account, args.spender]
    });
  }
  getAllowance2.call = call2;
})(getAllowance || (getAllowance = {}));
// node_modules/viem/_esm/actions/token/getBalance.js
init_abis();

// node_modules/viem/_esm/errors/account.js
init_base();

class AccountNotFoundError extends BaseError {
  constructor({ docsPath: docsPath8 } = {}) {
    super([
      "Could not find an Account to execute with this Action.",
      "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client."
    ].join(`
`), {
      docsPath: docsPath8,
      docsSlug: "account",
      name: "AccountNotFoundError"
    });
  }
}

// node_modules/viem/_esm/actions/token/getBalance.js
async function getBalance2(client, parameters) {
  const { account: account_ = client.account, decimals, token, ...rest } = parameters;
  if (!account_)
    throw new AccountNotFoundError;
  const account = parseAccount(account_).address;
  const [amount, { decimals: resolved }] = await Promise.all([
    readContract(client, {
      ...rest,
      ...getBalance2.call(client, { account, token })
    }),
    resolveTokenWithDecimals(client, {
      decimals,
      token
    })
  ]);
  return toAmount(amount, resolved);
}
(function(getBalance3) {
  function call2(client, args) {
    const account_ = args.account ?? client.account;
    if (!account_)
      throw new AccountNotFoundError;
    const account = parseAccount(account_).address;
    return defineCall({
      address: resolveToken(client, args).address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account]
    });
  }
  getBalance3.call = call2;
})(getBalance2 || (getBalance2 = {}));
// node_modules/viem/_esm/actions/token/getMetadata.js
init_abis();
async function getMetadata(client, parameters) {
  const { token, ...rest } = parameters;
  const { address } = resolveToken(client, { token });
  const declared = findDeclaredToken(client, token);
  const [decimals_, name, symbol] = await Promise.all([
    declared?.decimals ?? readContract(client, {
      ...rest,
      abi: erc20Abi,
      address,
      functionName: "decimals"
    }),
    declared?.name ?? readContract(client, {
      ...rest,
      abi: erc20Abi,
      address,
      functionName: "name"
    }),
    declared?.symbol ?? readContract(client, {
      ...rest,
      abi: erc20Abi,
      address,
      functionName: "symbol"
    })
  ]);
  return {
    decimals: decimals_,
    name,
    symbol
  };
}
// node_modules/viem/_esm/actions/token/getTotalSupply.js
init_abis();
async function getTotalSupply(client, parameters) {
  const { decimals, token, ...rest } = parameters;
  const [amount, { decimals: resolved }] = await Promise.all([
    readContract(client, {
      ...rest,
      ...getTotalSupply.call(client, { token })
    }),
    resolveTokenWithDecimals(client, {
      decimals,
      token
    })
  ]);
  return toAmount(amount, resolved);
}
(function(getTotalSupply2) {
  function call2(client, args) {
    return defineCall({
      address: resolveToken(client, args).address,
      abi: erc20Abi,
      args: [],
      functionName: "totalSupply"
    });
  }
  getTotalSupply2.call = call2;
})(getTotalSupply || (getTotalSupply = {}));
// node_modules/viem/_esm/actions/wallet/sendRawTransaction.js
async function sendRawTransaction(client, { serializedTransaction }) {
  return client.request({
    method: "eth_sendRawTransaction",
    params: [serializedTransaction]
  }, { retryCount: 0 });
}

// node_modules/viem/_esm/actions/wallet/sendRawTransactionSync.js
init_transaction();
async function sendRawTransactionSync(client, { serializedTransaction, throwOnReceiptRevert, timeout }) {
  const receipt = await client.request({
    method: "eth_sendRawTransactionSync",
    params: timeout ? [serializedTransaction, timeout] : [serializedTransaction]
  }, { retryCount: 0 });
  const format2 = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
  const formatted = format2(receipt);
  if (formatted.status === "reverted" && throwOnReceiptRevert)
    throw new TransactionReceiptRevertedError({ receipt: formatted });
  return formatted;
}

// node_modules/viem/_esm/clients/decorators/public.js
function publicActions(client) {
  return {
    call: (args) => call(client, args),
    createAccessList: (args) => createAccessList(client, args),
    createBlockFilter: () => createBlockFilter(client),
    createContractEventFilter: (args) => createContractEventFilter(client, args),
    createEventFilter: (args) => createEventFilter(client, args),
    createPendingTransactionFilter: () => createPendingTransactionFilter(client),
    estimateContractGas: (args) => estimateContractGas(client, args),
    estimateGas: (args) => estimateGas(client, args),
    getBalance: (args) => getBalance(client, args),
    getBlobBaseFee: () => getBlobBaseFee(client),
    getBlock: (args) => getBlock(client, args),
    getBlockNumber: (args) => getBlockNumber(client, args),
    getBlockReceipts: (args) => getBlockReceipts(client, args),
    getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
    getBytecode: (args) => getCode(client, args),
    getChainId: () => getChainId(client),
    getCode: (args) => getCode(client, args),
    getContractEvents: (args) => getContractEvents(client, args),
    getDelegation: (args) => getDelegation(client, args),
    getEip712Domain: (args) => getEip712Domain(client, args),
    getEnsAddress: (args) => getEnsAddress(client, args),
    getEnsAvatar: (args) => getEnsAvatar(client, args),
    getEnsName: (args) => getEnsName(client, args),
    getEnsResolver: (args) => getEnsResolver(client, args),
    getEnsText: (args) => getEnsText(client, args),
    getFeeHistory: (args) => getFeeHistory(client, args),
    estimateFeesPerGas: (args) => estimateFeesPerGas(client, args),
    getFilterChanges: (args) => getFilterChanges(client, args),
    getFilterLogs: (args) => getFilterLogs(client, args),
    getGasPrice: () => getGasPrice(client),
    getLogs: (args) => getLogs(client, args),
    getProof: (args) => getProof(client, args),
    estimateMaxPriorityFeePerGas: (args) => estimateMaxPriorityFeePerGas(client, args),
    fillTransaction: (args) => fillTransaction(client, args),
    getRawTransaction: (args) => getRawTransaction(client, args),
    getStorageAt: (args) => getStorageAt(client, args),
    getTransaction: (args) => getTransaction(client, args),
    getTransactionConfirmations: (args) => getTransactionConfirmations(client, args),
    getTransactionCount: (args) => getTransactionCount(client, args),
    getTransactionReceipt: (args) => getTransactionReceipt(client, args),
    multicall: (args) => multicall(client, args),
    prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
    readContract: (args) => readContract(client, args),
    sendRawTransaction: (args) => sendRawTransaction(client, args),
    sendRawTransactionSync: (args) => sendRawTransactionSync(client, args),
    simulate: (args) => simulateBlocks(client, args),
    simulateBlocks: (args) => simulateBlocks(client, args),
    simulateCalls: (args) => simulateCalls(client, args),
    simulateContract: (args) => simulateContract(client, args),
    verifyHash: (args) => verifyHash2(client, args),
    verifyMessage: (args) => verifyMessage2(client, args),
    verifySiweMessage: (args) => verifySiweMessage(client, args),
    verifyTypedData: (args) => verifyTypedData2(client, args),
    uninstallFilter: (args) => uninstallFilter(client, args),
    waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
    watchBlocks: (args) => watchBlocks(client, args),
    watchBlockNumber: (args) => watchBlockNumber(client, args),
    watchContractEvent: (args) => watchContractEvent(client, args),
    watchEvent: (args) => watchEvent(client, args),
    watchPendingTransactions: (args) => watchPendingTransactions(client, args),
    token: bindPublicToken(client)
  };
}
function bindPublicToken(client) {
  return {
    getAllowance: bindActionDecorators(client, getAllowance),
    getBalance: bindActionDecorators(client, getBalance2),
    getMetadata: bindActionDecorators(client, getMetadata),
    getTotalSupply: bindActionDecorators(client, getTotalSupply)
  };
}

// node_modules/viem/_esm/clients/createPublicClient.js
function createPublicClient(parameters) {
  const { key = "public", name = "Public Client" } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "publicClient"
  });
  return client.extend(publicActions);
}
// node_modules/viem/_esm/clients/transports/http.js
init_request();

// node_modules/viem/_esm/errors/transport.js
init_base();

class UrlRequiredError extends BaseError {
  constructor() {
    super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
      docsPath: "/docs/clients/intro",
      name: "UrlRequiredError"
    });
  }
}

// node_modules/viem/_esm/clients/transports/http.js
init_createBatchScheduler();

// node_modules/viem/_esm/utils/rpc/http.js
init_request();

// node_modules/viem/_esm/utils/promise/withTimeout.js
function withTimeout(fn, { errorInstance = new Error("timed out"), timeout, signal }) {
  return new Promise((resolve, reject) => {
    (async () => {
      let timeoutId;
      const controller = new AbortController;
      try {
        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            if (signal) {
              controller.abort();
            } else {
              reject(errorInstance);
            }
          }, timeout);
        }
        resolve(await fn({ signal: controller?.signal || null }));
      } catch (err) {
        if (controller?.signal.aborted && isAbortError(err)) {
          reject(errorInstance);
          return;
        }
        reject(err);
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  });
}
// node_modules/viem/_esm/utils/rpc/id.js
function createIdStore() {
  return {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    }
  };
}
var idCache = /* @__PURE__ */ createIdStore();

// node_modules/viem/_esm/utils/rpc/http.js
var defaultMaxResponseBodySize = 10485760;
function getHttpRpcClient2(url_, options = {}) {
  const { url, headers: headers_url } = parseUrl(url_);
  return {
    async request(params) {
      const { body, fetchFn = options.fetchFn ?? fetch, maxResponseBodySize = options.maxResponseBodySize ?? defaultMaxResponseBodySize, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
      const fetchOptions = {
        ...options.fetchOptions ?? {},
        ...params.fetchOptions ?? {}
      };
      const { headers, method, signal: signal_ } = fetchOptions;
      try {
        const response = await withTimeout(async ({ signal }) => {
          const init = {
            ...fetchOptions,
            body: Array.isArray(body) ? stringify(body.map((body2) => ({
              jsonrpc: "2.0",
              id: body2.id ?? idCache.take(),
              ...body2
            }))) : stringify({
              jsonrpc: "2.0",
              id: body.id ?? idCache.take(),
              ...body
            }),
            headers: {
              ...headers_url,
              "Content-Type": "application/json",
              ...headers
            },
            method: method || "POST",
            signal: signal_ || (timeout > 0 ? signal : null)
          };
          const request = new Request(url, init);
          const args = await onRequest?.(request, init) ?? { ...init, url };
          const response2 = await fetchFn(args.url ?? url, args);
          return response2;
        }, {
          errorInstance: new TimeoutError({ body, url }),
          timeout,
          signal: true
        });
        if (onResponse)
          await onResponse(response);
        let data;
        const responseBody = await readResponseBody(response, {
          maxResponseBodySize
        });
        if (response.headers.get("Content-Type")?.startsWith("application/json"))
          data = JSON.parse(responseBody);
        else {
          data = responseBody;
          try {
            data = JSON.parse(data || "{}");
          } catch (err) {
            if (response.ok)
              throw err;
            data = { error: data };
          }
        }
        if (!response.ok) {
          if (typeof data.error?.code === "number" && typeof data.error?.message === "string")
            return data;
          throw new HttpRequestError({
            body,
            details: stringify(data.error) || response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
        }
        return data;
      } catch (err) {
        if (signal_?.aborted)
          throw getAbortError(signal_);
        if (isAbortError(err))
          throw err;
        if (err instanceof HttpRequestError)
          throw err;
        if (err instanceof ResponseBodyTooLargeError)
          throw err;
        if (err instanceof TimeoutError)
          throw err;
        throw new HttpRequestError({
          body,
          cause: err,
          url
        });
      }
    }
  };
}
async function readResponseBody(response, { maxResponseBodySize }) {
  if (maxResponseBodySize === false)
    return response.text();
  const contentLength = response.headers.get("Content-Length");
  if (contentLength) {
    const size7 = Number(contentLength);
    if (size7 > maxResponseBodySize)
      throw new ResponseBodyTooLargeError({
        maxSize: maxResponseBodySize,
        size: size7
      });
  }
  if (!response.body) {
    const body2 = await response.text();
    const size7 = new TextEncoder().encode(body2).length;
    if (size7 > maxResponseBodySize)
      throw new ResponseBodyTooLargeError({
        maxSize: maxResponseBodySize,
        size: size7
      });
    return body2;
  }
  const reader = response.body.getReader();
  const decoder2 = new TextDecoder;
  let body = "";
  let size6 = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done)
        break;
      size6 += value.byteLength;
      if (size6 > maxResponseBodySize) {
        await reader.cancel();
        throw new ResponseBodyTooLargeError({
          maxSize: maxResponseBodySize,
          size: size6
        });
      }
      body += decoder2.decode(value, { stream: true });
    }
    body += decoder2.decode();
    return body;
  } finally {
    reader.releaseLock();
  }
}
function parseUrl(url_) {
  try {
    const url = new URL(url_);
    const result = (() => {
      if (url.username) {
        const credentials = `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`;
        url.username = "";
        url.password = "";
        return {
          url: url.toString(),
          headers: { Authorization: `Basic ${btoa(credentials)}` }
        };
      }
      return;
    })();
    return { url: url.toString(), ...result };
  } catch {
    return { url: url_ };
  }
}

// node_modules/viem/_esm/utils/buildRequest.js
init_base();
init_request();
init_rpc();

// node_modules/viem/_esm/utils/promise/withDedupe.js
init_lru();
var promiseCache2 = /* @__PURE__ */ new LruMap(8192);
function withDedupe(fn, { enabled = true, id }) {
  if (!enabled || !id)
    return fn();
  if (promiseCache2.get(id))
    return promiseCache2.get(id);
  const promise = fn().finally(() => promiseCache2.delete(id));
  promiseCache2.set(id, promise);
  return promise;
}

// node_modules/viem/_esm/utils/buildRequest.js
function buildRequest2(request, options = {}) {
  return async (args, overrideOptions = {}) => {
    const { dedupe = false, methods, retryDelay = 150, retryCount = 3, signal, uid: uid2 } = {
      ...options,
      ...overrideOptions
    };
    const { method } = args;
    if (methods?.exclude?.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    if (methods?.include && !methods.include.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    if (signal?.aborted)
      throw getAbortError(signal);
    const requestId = dedupe ? hashString(`${uid2}.${stringify(args)}`) : undefined;
    return withDedupe(() => withRetry(async () => {
      try {
        return await request(args, signal ? { signal } : undefined);
      } catch (err_) {
        if (signal?.aborted)
          throw getAbortError(signal);
        if (isAbortError(err_))
          throw err_;
        const err = err_;
        switch (err.code) {
          case ParseRpcError.code:
            throw new ParseRpcError(err);
          case InvalidRequestRpcError.code:
            throw new InvalidRequestRpcError(err);
          case MethodNotFoundRpcError.code:
            throw new MethodNotFoundRpcError(err, { method: args.method });
          case InvalidParamsRpcError.code:
            throw new InvalidParamsRpcError(err);
          case InternalRpcError.code:
            throw new InternalRpcError(err);
          case InvalidInputRpcError.code:
            throw new InvalidInputRpcError(err);
          case ResourceNotFoundRpcError.code:
            throw new ResourceNotFoundRpcError(err);
          case ResourceUnavailableRpcError.code:
            throw new ResourceUnavailableRpcError(err);
          case TransactionRejectedRpcError.code:
            throw new TransactionRejectedRpcError(err);
          case MethodNotSupportedRpcError.code:
            throw new MethodNotSupportedRpcError(err, {
              method: args.method
            });
          case LimitExceededRpcError.code:
            throw new LimitExceededRpcError(err);
          case JsonRpcVersionUnsupportedError.code:
            throw new JsonRpcVersionUnsupportedError(err);
          case UserRejectedRequestError.code:
            throw new UserRejectedRequestError(err);
          case UnauthorizedProviderError.code:
            throw new UnauthorizedProviderError(err);
          case UnsupportedProviderMethodError.code:
            throw new UnsupportedProviderMethodError(err);
          case ProviderDisconnectedError.code:
            throw new ProviderDisconnectedError(err);
          case ChainDisconnectedError.code:
            throw new ChainDisconnectedError(err);
          case SwitchChainError.code:
            throw new SwitchChainError(err);
          case UnsupportedNonOptionalCapabilityError.code:
            throw new UnsupportedNonOptionalCapabilityError(err);
          case UnsupportedChainIdError.code:
            throw new UnsupportedChainIdError(err);
          case DuplicateIdError.code:
            throw new DuplicateIdError(err);
          case UnknownBundleIdError.code:
            throw new UnknownBundleIdError(err);
          case BundleTooLargeError.code:
            throw new BundleTooLargeError(err);
          case AtomicReadyWalletRejectedUpgradeError.code:
            throw new AtomicReadyWalletRejectedUpgradeError(err);
          case AtomicityNotSupportedError.code:
            throw new AtomicityNotSupportedError(err);
          case 5000:
            throw new UserRejectedRequestError(err);
          case WalletConnectSessionSettlementError.code:
            throw new WalletConnectSessionSettlementError(err);
          default:
            if (err_ instanceof BaseError)
              throw err_;
            throw new UnknownRpcError(err);
        }
      }
    }, {
      delay: ({ count, error }) => {
        if (error && error instanceof HttpRequestError) {
          const retryAfter = error?.headers?.get("Retry-After");
          if (retryAfter?.match(/\d/))
            return Number.parseInt(retryAfter, 10) * 1000;
        }
        return ~~(1 << count) * retryDelay;
      },
      retryCount,
      signal,
      shouldRetry: ({ error }) => shouldRetry(error)
    }), { enabled: dedupe, id: requestId });
  };
}
function shouldRetry(error) {
  if (isAbortError(error))
    return false;
  if ("code" in error && typeof error.code === "number") {
    if (error.code === -1)
      return true;
    if (error.code === LimitExceededRpcError.code)
      return true;
    if (error.code === InternalRpcError.code)
      return true;
    if (error.code === 429)
      return true;
    return false;
  }
  if (error instanceof HttpRequestError && error.status) {
    if (error.status === 403)
      return true;
    if (error.status === 408)
      return true;
    if (error.status === 413)
      return true;
    if (error.status === 429)
      return true;
    if (error.status === 500)
      return true;
    if (error.status === 502)
      return true;
    if (error.status === 503)
      return true;
    if (error.status === 504)
      return true;
    return false;
  }
  return true;
}
function hashString(str, seed = 0) {
  let h1 = 3735928559 ^ seed;
  let h2 = 1103547991 ^ seed;
  for (let i = 0;i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
  h1 ^= Math.imul(h2 ^ h2 >>> 16, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507);
  h2 ^= Math.imul(h1 ^ h1 >>> 16, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

// node_modules/viem/_esm/clients/transports/createTransport.js
function createTransport({ key, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
  const uid2 = uid();
  return {
    config: {
      key,
      methods,
      name,
      request,
      retryCount,
      retryDelay,
      timeout,
      type
    },
    request: buildRequest2(request, { methods, retryCount, retryDelay, uid: uid2 }),
    value
  };
}

// node_modules/viem/_esm/clients/transports/http.js
var signalId = 0;
var signalIds = new WeakMap;
function getSignalId(signal) {
  if (!signal)
    return "default";
  const id = signalIds.get(signal);
  if (id !== undefined)
    return id;
  const nextId = signalId++;
  signalIds.set(signal, nextId);
  return nextId;
}
function http(url, config2 = {}) {
  const { batch, fetchFn, fetchOptions, key = "http", maxResponseBodySize, methods, name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay, raw: raw2 } = config2;
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    const { batchSize = 1000, wait: wait2 = 0 } = typeof batch === "object" ? batch : {};
    const retryCount = config2.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config2.timeout ?? 1e4;
    const url_ = url || chain?.rpcUrls.default.http[0];
    if (!url_)
      throw new UrlRequiredError;
    const rpcClient = getHttpRpcClient2(url_, {
      fetchFn,
      fetchOptions,
      maxResponseBodySize,
      onRequest: onFetchRequest,
      onResponse: onFetchResponse,
      timeout
    });
    return createTransport({
      key,
      methods,
      name,
      async request({ method, params }, options) {
        const body = { method, params };
        const fetchOptions2 = options?.signal ? { signal: options.signal } : undefined;
        const { schedule } = createBatchScheduler({
          id: `${url_}.${getSignalId(options?.signal)}`,
          wait: wait2,
          shouldSplitBatch(requests) {
            return requests.length > batchSize;
          },
          fn: (body2) => rpcClient.request({
            body: body2,
            fetchOptions: fetchOptions2
          }),
          sort: (a, b) => a.id - b.id
        });
        const fn = async (body2) => batch ? schedule(body2) : [
          await rpcClient.request({
            body: body2,
            fetchOptions: fetchOptions2
          })
        ];
        const [{ error, result }] = await fn(body);
        if (raw2)
          return { error, result };
        if (error)
          throw new RpcRequestError({
            body,
            error,
            url: url_
          });
        return result;
      },
      retryCount,
      retryDelay,
      timeout,
      type: "http"
    }, {
      fetchOptions,
      url: url_
    });
  };
}

// node_modules/viem/_esm/index.js
init_encodeFunctionData();
init_getAddress();

// src/services/flareClient.ts
var flareClient = createPublicClient({
  transport: http(config.flareRpcUrl)
});

// src/contracts/flare.ts
var FLARE_CONTRACTS = {
  v3CoreFactoryAddress: "0x1421C7dAD1E58af4aDb81F9e9BBD2533E4395535",
  multicall2Address: "0xfc3365f1d9eDf95a5f960a18cA94eb5168AA103c",
  tickLensAddress: "0x9832D690ACd7287D61789Eb5AADf2d35427ef4Cf",
  nonfungibleTokenPositionManagerAddress: "0xe69b854a30D04c4DDf1ecCB7c30291184154c72D",
  quoterV2Address: "0x1f404A1Ae590f7B60DB8d17464dA01A79A83eDCd",
  swapRouter02Address: "0x2f6EF6F5e0A44Fc123683160d991329aD1E6e37"
};

// src/contracts/v3Abi.ts
var factoryAbi = [
  {
    type: "function",
    name: "createPool",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "fee", type: "uint24" }
    ],
    outputs: [
      { name: "pool", type: "address" }
    ]
  },
  {
    type: "function",
    name: "getPool",
    stateMutability: "view",
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "fee", type: "uint24" }
    ],
    outputs: [
      { name: "pool", type: "address" }
    ]
  }
];
var poolAbi = [
  {
    type: "function",
    name: "initialize",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "sqrtPriceX96",
        type: "uint160"
      }
    ],
    outputs: []
  }
];
var positionManagerAbi = [
  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "token0", type: "address" },
          { name: "token1", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "tickLower", type: "int24" },
          { name: "tickUpper", type: "int24" },
          { name: "amount0Desired", type: "uint256" },
          { name: "amount1Desired", type: "uint256" },
          { name: "amount0Min", type: "uint256" },
          { name: "amount1Min", type: "uint256" },
          { name: "recipient", type: "address" },
          { name: "deadline", type: "uint256" }
        ]
      }
    ],
    outputs: [
      { name: "tokenId", type: "uint256" },
      { name: "liquidity", type: "uint128" },
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" }
    ]
  }
];
var poolStateAbi = [
  {
    type: "function",
    name: "slot0",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "tick", type: "int24" },
      { name: "observationIndex", type: "uint16" },
      { name: "observationCardinality", type: "uint16" },
      { name: "observationCardinalityNext", type: "uint16" },
      { name: "feeProtocol", type: "uint8" },
      { name: "unlocked", type: "bool" }
    ]
  },
  {
    type: "function",
    name: "tickSpacing",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "int24"
      }
    ]
  }
];
var quoterV2Abi = [
  {
    type: "function",
    name: "quoteExactInputSingle",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "fee", type: "uint24" },
          { name: "sqrtPriceLimitX96", type: "uint160" }
        ]
      }
    ],
    outputs: [
      { name: "amountOut", type: "uint256" },
      { name: "sqrtPriceX96After", type: "uint160" },
      { name: "initializedTicksCrossed", type: "uint32" },
      { name: "gasEstimate", type: "uint256" }
    ]
  }
];

// src/services/liquidity.ts
async function getPoolAddress(tokenA, tokenB, fee) {
  const pool = await flareClient.readContract({
    address: FLARE_CONTRACTS.v3CoreFactoryAddress,
    abi: factoryAbi,
    functionName: "getPool",
    args: [tokenA, tokenB, fee]
  });
  return pool;
}
async function ensurePool(tokenA, tokenB, fee) {
  const existingPool = await getPoolAddress(tokenA, tokenB, fee);
  if (existingPool !== "0x0000000000000000000000000000000000000000") {
    return {
      created: false,
      pool: existingPool
    };
  }
  return {
    created: false,
    pool: null,
    message: "Pool does not exist. Creation requires wallet transaction."
  };
}

// src/routes/liquidity.ts
var liquidityRoutes = new Hono2;
liquidityRoutes.post("/check-pool", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const result = await ensurePool(body.tokenA, body.tokenB, Number(body.fee));
  return c.json(result);
});
liquidityRoutes.post("/PoolInfo", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  console.log("PoolInfo", body);
  return c.json({
    pool: {
      id: body.poolId ?? body.address ?? "",
      address: body.address ?? "",
      token0: null,
      token1: null,
      feeTier: 3000,
      liquidity: "0"
    }
  });
});

// src/services/createPool.ts
function buildCreatePoolCalldata(tokenA, tokenB, fee) {
  const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
  return {
    to: FLARE_CONTRACTS.v3CoreFactoryAddress,
    data: encodeFunctionData({
      abi: factoryAbi,
      functionName: "createPool",
      args: [
        token0,
        token1,
        fee
      ]
    })
  };
}

// src/routes/createPool.ts
var createPoolRoutes = new Hono2;
createPoolRoutes.post("/", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const tx = buildCreatePoolCalldata(body.tokenA, body.tokenB, Number(body.fee));
  return c.json(tx);
});

// src/services/initializePool.ts
function buildInitializePoolCalldata(pool, sqrtPriceX96) {
  return {
    to: pool,
    data: encodeFunctionData({
      abi: poolAbi,
      functionName: "initialize",
      args: [sqrtPriceX96]
    })
  };
}

// src/routes/initializePool.ts
var initializePoolRoutes = new Hono2;
initializePoolRoutes.post("/", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const tx = buildInitializePoolCalldata(body.pool, BigInt(body.sqrtPriceX96));
  return c.json({
    ...tx,
    sqrtPriceX96: body.sqrtPriceX96
  });
});

// src/services/tokenOrder.ts
function sortTokens(tokenA, tokenB) {
  if (tokenA.toLowerCase() < tokenB.toLowerCase()) {
    return {
      token0: tokenA,
      token1: tokenB
    };
  }
  return {
    token0: tokenB,
    token1: tokenA
  };
}

// src/services/mintPosition.ts
function buildMintPositionCalldata(params) {
  const { token0, token1 } = sortTokens(params.token0, params.token1);
  return {
    to: FLARE_CONTRACTS.nonfungibleTokenPositionManagerAddress,
    data: encodeFunctionData({
      abi: positionManagerAbi,
      functionName: "mint",
      args: [
        {
          token0,
          token1,
          fee: params.fee,
          tickLower: params.tickLower,
          tickUpper: params.tickUpper,
          amount0Desired: params.amount0Desired,
          amount1Desired: params.amount1Desired,
          amount0Min: params.amount0Min,
          amount1Min: params.amount1Min,
          recipient: params.recipient,
          deadline: params.deadline
        }
      ]
    })
  };
}

// src/routes/mintPosition.ts
var mintPositionRoutes = new Hono2;
mintPositionRoutes.post("/", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const tx = buildMintPositionCalldata({
    ...body,
    fee: Number(body.fee),
    amount0Desired: BigInt(body.amount0Desired),
    amount1Desired: BigInt(body.amount1Desired),
    amount0Min: BigInt(body.amount0Min),
    amount1Min: BigInt(body.amount1Min),
    deadline: BigInt(body.deadline)
  });
  return c.json(tx);
});

// src/services/poolStateReader.ts
var poolAbi2 = [
  {
    type: "function",
    name: "slot0",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "tick", type: "int24" },
      { name: "observationIndex", type: "uint16" },
      { name: "observationCardinality", type: "uint16" },
      { name: "observationCardinalityNext", type: "uint16" },
      { name: "feeProtocol", type: "uint8" },
      { name: "unlocked", type: "bool" }
    ]
  },
  {
    type: "function",
    name: "liquidity",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint128"
      }
    ]
  },
  {
    type: "function",
    name: "token0",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address"
      }
    ]
  },
  {
    type: "function",
    name: "token1",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address"
      }
    ]
  },
  {
    type: "function",
    name: "fee",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint24"
      }
    ]
  }
];
var client = createPublicClient({
  transport: http(config.flareRpcUrl)
});
async function getPoolState(address) {
  const [
    slot0,
    liquidity,
    token0,
    token1,
    fee
  ] = await Promise.all([
    client.readContract({
      address,
      abi: poolAbi2,
      functionName: "slot0"
    }),
    client.readContract({
      address,
      abi: poolAbi2,
      functionName: "liquidity"
    }),
    client.readContract({
      address,
      abi: poolAbi2,
      functionName: "token0"
    }),
    client.readContract({
      address,
      abi: poolAbi2,
      functionName: "token1"
    }),
    client.readContract({
      address,
      abi: poolAbi2,
      functionName: "fee"
    })
  ]);
  return {
    slot0,
    liquidity,
    token0,
    token1,
    fee
  };
}

// src/routes/poolState.ts
var poolStateRoutes = new Hono2;
poolStateRoutes.get("/:address", async (c) => {
  try {
    const address = c.req.param("address");
    const state = await getPoolState(address);
    return c.json(state);
  } catch (error) {
    return c.json({
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// src/config/contracts.ts
var FLARE_CONTRACTS2 = {
  v3CoreFactoryAddress: "0x1421C7dAD1E58af4aDb81F9e9BBD2533E4395535",
  multicall2Address: "0xfc3365f1d9eDf95a5f960a18cA94eb5168AA103c",
  tickLensAddress: "0x9832D690ACd7287D61789Eb5AADf2d35427ef4Cf",
  positionManagerAddress: "0xe69b854a30D04c4DDf1ecCB7c30291184154c72D",
  quoterV2Address: "0x1f404A1Ae590f7B60DB8d17464dA01A79A83eDCd",
  swapRouter02: "0x2f6EF6F5e0aE44Fc123683160d991329aD1E6e37"
};

// src/services/tickReader.ts
var tickLensAbi = [
  {
    type: "function",
    name: "getPopulatedTicksInWord",
    stateMutability: "view",
    inputs: [
      {
        name: "pool",
        type: "address"
      },
      {
        name: "tickBitmapIndex",
        type: "int16"
      }
    ],
    outputs: [
      {
        name: "populatedTicks",
        type: "tuple[]",
        components: [
          {
            name: "tick",
            type: "int24"
          },
          {
            name: "liquidityGross",
            type: "uint128"
          },
          {
            name: "liquidityNet",
            type: "int128"
          }
        ]
      }
    ]
  }
];
var client2 = createPublicClient({
  transport: http(config.flareRpcUrl)
});
async function getTicks(pool, word = 0) {
  return client2.readContract({
    address: FLARE_CONTRACTS2.tickLensAddress,
    abi: tickLensAbi,
    functionName: "getPopulatedTicksInWord",
    args: [
      pool,
      word
    ]
  });
}

// src/routes/ticks.ts
var tickRoutes = new Hono2;
tickRoutes.get("/:address", async (c) => {
  try {
    const address = c.req.param("address");
    const word = Number(c.req.query("word") ?? 0);
    const ticks = await getTicks(address, word);
    return c.json({
      ticks
    });
  } catch (error) {
    return c.json({
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// src/services/approveBuilder.ts
var erc20Abi3 = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "spender",
        type: "address"
      },
      {
        name: "amount",
        type: "uint256"
      }
    ],
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ]
  }
];
function buildApproveCalldata(params) {
  return encodeFunctionData({
    abi: erc20Abi3,
    functionName: "approve",
    args: [
      params.spender,
      params.amount
    ]
  });
}

// src/routes/approve.ts
var approveRoutes = new Hono2;
approveRoutes.post("/", async (c) => {
  try {
    let body = {};
    try {
      body = await c.req.json();
    } catch {
      console.log("EMPTY JSON BODY", c.req.path);
    }
    const data = buildApproveCalldata({
      spender: body.spender ?? FLARE_CONTRACTS2.positionManagerAddress,
      amount: BigInt(body.amount)
    });
    return c.json({
      to: body.token,
      data,
      value: "0"
    });
  } catch (error) {
    return c.json({
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// src/services/multicallBuilder.ts
var multicallAbi = [
  {
    type: "function",
    name: "aggregate",
    stateMutability: "payable",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        components: [
          {
            name: "target",
            type: "address"
          },
          {
            name: "callData",
            type: "bytes"
          }
        ]
      }
    ],
    outputs: [
      {
        name: "blockNumber",
        type: "uint256"
      },
      {
        name: "returnData",
        type: "bytes[]"
      }
    ]
  }
];
function buildMulticallCalldata(calls) {
  return encodeFunctionData({
    abi: multicallAbi,
    functionName: "aggregate",
    args: [
      calls.map((call2) => ({
        target: call2.to,
        callData: call2.data
      }))
    ]
  });
}
function getMulticallAddress2() {
  return FLARE_CONTRACTS2.multicall2Address;
}

// src/routes/multicall.ts
var multicallRoutes = new Hono2;
multicallRoutes.post("/", async (c) => {
  try {
    let body = {};
    try {
      body = await c.req.json();
    } catch {
      console.log("EMPTY JSON BODY", c.req.path);
    }
    const data = buildMulticallCalldata(body.calls);
    return c.json({
      to: getMulticallAddress2(),
      data,
      value: "0"
    });
  } catch (error) {
    return c.json({
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// src/services/poolReader.ts
var factoryAbi2 = [
  {
    type: "function",
    name: "getPool",
    stateMutability: "view",
    inputs: [
      {
        name: "tokenA",
        type: "address"
      },
      {
        name: "tokenB",
        type: "address"
      },
      {
        name: "fee",
        type: "uint24"
      }
    ],
    outputs: [
      {
        name: "pool",
        type: "address"
      }
    ]
  }
];
var client3 = createPublicClient({
  transport: http(config.flareRpcUrl)
});
async function getPoolAddress2(tokenA, tokenB, fee) {
  const token0 = getAddress(tokenA.toLowerCase() < tokenB.toLowerCase() ? tokenA : tokenB);
  const token1 = getAddress(tokenA.toLowerCase() < tokenB.toLowerCase() ? tokenB : tokenA);
  const pool = await client3.readContract({
    address: FLARE_CONTRACTS2.v3CoreFactoryAddress,
    abi: factoryAbi2,
    functionName: "getPool",
    args: [
      token0,
      token1,
      fee
    ]
  });
  return pool;
}

// src/routes/poolAddress.ts
var poolAddressRoutes = new Hono2;
poolAddressRoutes.post("/", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const pool = await getPoolAddress2(body.tokenA, body.tokenB, Number(body.fee));
  return c.json({
    pool
  });
});

// src/services/positionBuilder.ts
var positionManagerAbi2 = [
  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "token0", type: "address" },
          { name: "token1", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "tickLower", type: "int24" },
          { name: "tickUpper", type: "int24" },
          { name: "amount0Desired", type: "uint256" },
          { name: "amount1Desired", type: "uint256" },
          { name: "amount0Min", type: "uint256" },
          { name: "amount1Min", type: "uint256" },
          { name: "recipient", type: "address" },
          { name: "deadline", type: "uint256" }
        ]
      }
    ],
    outputs: [
      { name: "tokenId", type: "uint256" },
      { name: "liquidity", type: "uint128" },
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" }
    ]
  }
];
function buildMintCalldata(params) {
  return encodeFunctionData({
    abi: positionManagerAbi2,
    functionName: "mint",
    args: [
      {
        token0: params.token0,
        token1: params.token1,
        fee: params.fee,
        tickLower: params.tickLower,
        tickUpper: params.tickUpper,
        amount0Desired: params.amount0Desired,
        amount1Desired: params.amount1Desired,
        amount0Min: 0n,
        amount1Min: 0n,
        recipient: params.recipient,
        deadline: params.deadline
      }
    ]
  });
}
function buildPosition(params) {
  return params;
}

// src/routes/positionBuild.ts
var positionBuildRoutes = new Hono2;
positionBuildRoutes.post("/", async (c) => {
  try {
    let body = {};
    try {
      body = await c.req.json();
    } catch {
      console.log("EMPTY JSON BODY", c.req.path);
    }
    const data = buildMintCalldata({
      token0: body.token0,
      token1: body.token1,
      fee: Number(body.fee),
      tickLower: Number(body.tickLower),
      tickUpper: Number(body.tickUpper),
      amount0Desired: BigInt(body.amount0Desired),
      amount1Desired: BigInt(body.amount1Desired),
      recipient: body.recipient,
      deadline: BigInt(body.deadline)
    });
    return c.json({
      to: FLARE_CONTRACTS2.positionManagerAddress,
      data,
      value: "0"
    });
  } catch (error) {
    return c.json({
      error: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// src/services/poolState.ts
async function getPoolState2(pool) {
  const [slot0, tickSpacing] = await Promise.all([
    flareClient.readContract({
      address: pool,
      abi: poolStateAbi,
      functionName: "slot0"
    }),
    flareClient.readContract({
      address: pool,
      abi: poolStateAbi,
      functionName: "tickSpacing"
    })
  ]);
  return {
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
    tickSpacing
  };
}

// node_modules/jsbi/dist/jsbi.mjs
class JSBI extends Array {
  constructor(i, _) {
    if (super(i), this.sign = _, i > JSBI.__kMaxLength)
      throw new RangeError("Maximum BigInt size exceeded");
  }
  static BigInt(i) {
    var _ = Math.floor, t = Number.isFinite;
    if (typeof i == "number") {
      if (i === 0)
        return JSBI.__zero();
      if (JSBI.__isOneDigitInt(i))
        return 0 > i ? JSBI.__oneDigit(-i, true) : JSBI.__oneDigit(i, false);
      if (!t(i) || _(i) !== i)
        throw new RangeError("The number " + i + " cannot be converted to BigInt because it is not an integer");
      return JSBI.__fromDouble(i);
    }
    if (typeof i == "string") {
      const _2 = JSBI.__fromString(i);
      if (_2 === null)
        throw new SyntaxError("Cannot convert " + i + " to a BigInt");
      return _2;
    }
    if (typeof i == "boolean")
      return i === true ? JSBI.__oneDigit(1, false) : JSBI.__zero();
    if (typeof i == "object") {
      if (i.constructor === JSBI)
        return i;
      const _2 = JSBI.__toPrimitive(i);
      return JSBI.BigInt(_2);
    }
    throw new TypeError("Cannot convert " + i + " to a BigInt");
  }
  toDebugString() {
    const i = ["BigInt["];
    for (const _ of this)
      i.push((_ ? (_ >>> 0).toString(16) : _) + ", ");
    return i.push("]"), i.join("");
  }
  toString(i = 10) {
    if (2 > i || 36 < i)
      throw new RangeError("toString() radix argument must be between 2 and 36");
    return this.length === 0 ? "0" : (i & i - 1) == 0 ? JSBI.__toStringBasePowerOfTwo(this, i) : JSBI.__toStringGeneric(this, i, false);
  }
  static toNumber(i) {
    const _ = i.length;
    if (_ === 0)
      return 0;
    if (_ === 1) {
      const _2 = i.__unsignedDigit(0);
      return i.sign ? -_2 : _2;
    }
    const t = i.__digit(_ - 1), e = JSBI.__clz30(t), n = 30 * _ - e;
    if (1024 < n)
      return i.sign ? -Infinity : 1 / 0;
    let g = n - 1, o = t, s = _ - 1;
    const l = e + 3;
    let r = l === 32 ? 0 : o << l;
    r >>>= 12;
    const a = l - 12;
    let u = 12 <= l ? 0 : o << 20 + l, d = 20 + l;
    for (0 < a && 0 < s && (s--, o = i.__digit(s), r |= o >>> 30 - a, u = o << a + 2, d = a + 2);0 < d && 0 < s; )
      s--, o = i.__digit(s), u |= 30 <= d ? o << d - 30 : o >>> 30 - d, d -= 30;
    const h = JSBI.__decideRounding(i, d, s, o);
    if ((h === 1 || h === 0 && (1 & u) == 1) && (u = u + 1 >>> 0, u === 0 && (r++, r >>> 20 != 0 && (r = 0, g++, 1023 < g))))
      return i.sign ? -Infinity : 1 / 0;
    const m = i.sign ? -2147483648 : 0;
    return g = g + 1023 << 20, JSBI.__kBitConversionInts[1] = m | g | r, JSBI.__kBitConversionInts[0] = u, JSBI.__kBitConversionDouble[0];
  }
  static unaryMinus(i) {
    if (i.length === 0)
      return i;
    const _ = i.__copy();
    return _.sign = !i.sign, _;
  }
  static bitwiseNot(i) {
    return i.sign ? JSBI.__absoluteSubOne(i).__trim() : JSBI.__absoluteAddOne(i, true);
  }
  static exponentiate(i, _) {
    if (_.sign)
      throw new RangeError("Exponent must be positive");
    if (_.length === 0)
      return JSBI.__oneDigit(1, false);
    if (i.length === 0)
      return i;
    if (i.length === 1 && i.__digit(0) === 1)
      return i.sign && (1 & _.__digit(0)) == 0 ? JSBI.unaryMinus(i) : i;
    if (1 < _.length)
      throw new RangeError("BigInt too big");
    let t = _.__unsignedDigit(0);
    if (t === 1)
      return i;
    if (t >= JSBI.__kMaxLengthBits)
      throw new RangeError("BigInt too big");
    if (i.length === 1 && i.__digit(0) === 2) {
      const _2 = 1 + (0 | t / 30), e2 = i.sign && (1 & t) != 0, n2 = new JSBI(_2, e2);
      n2.__initializeDigits();
      const g = 1 << t % 30;
      return n2.__setDigit(_2 - 1, g), n2;
    }
    let e = null, n = i;
    for ((1 & t) != 0 && (e = i), t >>= 1;t !== 0; t >>= 1)
      n = JSBI.multiply(n, n), (1 & t) != 0 && (e === null ? e = n : e = JSBI.multiply(e, n));
    return e;
  }
  static multiply(_, t) {
    if (_.length === 0)
      return _;
    if (t.length === 0)
      return t;
    let i = _.length + t.length;
    30 <= _.__clzmsd() + t.__clzmsd() && i--;
    const e = new JSBI(i, _.sign !== t.sign);
    e.__initializeDigits();
    for (let n = 0;n < _.length; n++)
      JSBI.__multiplyAccumulate(t, _.__digit(n), e, n);
    return e.__trim();
  }
  static divide(i, _) {
    if (_.length === 0)
      throw new RangeError("Division by zero");
    if (0 > JSBI.__absoluteCompare(i, _))
      return JSBI.__zero();
    const t = i.sign !== _.sign, e = _.__unsignedDigit(0);
    let n;
    if (_.length === 1 && 32767 >= e) {
      if (e === 1)
        return t === i.sign ? i : JSBI.unaryMinus(i);
      n = JSBI.__absoluteDivSmall(i, e, null);
    } else
      n = JSBI.__absoluteDivLarge(i, _, true, false);
    return n.sign = t, n.__trim();
  }
  static remainder(i, _) {
    if (_.length === 0)
      throw new RangeError("Division by zero");
    if (0 > JSBI.__absoluteCompare(i, _))
      return i;
    const t = _.__unsignedDigit(0);
    if (_.length === 1 && 32767 >= t) {
      if (t === 1)
        return JSBI.__zero();
      const _2 = JSBI.__absoluteModSmall(i, t);
      return _2 === 0 ? JSBI.__zero() : JSBI.__oneDigit(_2, i.sign);
    }
    const e = JSBI.__absoluteDivLarge(i, _, false, true);
    return e.sign = i.sign, e.__trim();
  }
  static add(i, _) {
    const t = i.sign;
    return t === _.sign ? JSBI.__absoluteAdd(i, _, t) : 0 <= JSBI.__absoluteCompare(i, _) ? JSBI.__absoluteSub(i, _, t) : JSBI.__absoluteSub(_, i, !t);
  }
  static subtract(i, _) {
    const t = i.sign;
    return t === _.sign ? 0 <= JSBI.__absoluteCompare(i, _) ? JSBI.__absoluteSub(i, _, t) : JSBI.__absoluteSub(_, i, !t) : JSBI.__absoluteAdd(i, _, t);
  }
  static leftShift(i, _) {
    return _.length === 0 || i.length === 0 ? i : _.sign ? JSBI.__rightShiftByAbsolute(i, _) : JSBI.__leftShiftByAbsolute(i, _);
  }
  static signedRightShift(i, _) {
    return _.length === 0 || i.length === 0 ? i : _.sign ? JSBI.__leftShiftByAbsolute(i, _) : JSBI.__rightShiftByAbsolute(i, _);
  }
  static unsignedRightShift() {
    throw new TypeError("BigInts have no unsigned right shift; use >> instead");
  }
  static lessThan(i, _) {
    return 0 > JSBI.__compareToBigInt(i, _);
  }
  static lessThanOrEqual(i, _) {
    return 0 >= JSBI.__compareToBigInt(i, _);
  }
  static greaterThan(i, _) {
    return 0 < JSBI.__compareToBigInt(i, _);
  }
  static greaterThanOrEqual(i, _) {
    return 0 <= JSBI.__compareToBigInt(i, _);
  }
  static equal(_, t) {
    if (_.sign !== t.sign)
      return false;
    if (_.length !== t.length)
      return false;
    for (let e = 0;e < _.length; e++)
      if (_.__digit(e) !== t.__digit(e))
        return false;
    return true;
  }
  static notEqual(i, _) {
    return !JSBI.equal(i, _);
  }
  static bitwiseAnd(i, _) {
    var t = Math.max;
    if (!i.sign && !_.sign)
      return JSBI.__absoluteAnd(i, _).__trim();
    if (i.sign && _.sign) {
      const e = t(i.length, _.length) + 1;
      let n = JSBI.__absoluteSubOne(i, e);
      const g = JSBI.__absoluteSubOne(_);
      return n = JSBI.__absoluteOr(n, g, n), JSBI.__absoluteAddOne(n, true, n).__trim();
    }
    return i.sign && ([i, _] = [_, i]), JSBI.__absoluteAndNot(i, JSBI.__absoluteSubOne(_)).__trim();
  }
  static bitwiseXor(i, _) {
    var t = Math.max;
    if (!i.sign && !_.sign)
      return JSBI.__absoluteXor(i, _).__trim();
    if (i.sign && _.sign) {
      const e2 = t(i.length, _.length), n2 = JSBI.__absoluteSubOne(i, e2), g = JSBI.__absoluteSubOne(_);
      return JSBI.__absoluteXor(n2, g, n2).__trim();
    }
    const e = t(i.length, _.length) + 1;
    i.sign && ([i, _] = [_, i]);
    let n = JSBI.__absoluteSubOne(_, e);
    return n = JSBI.__absoluteXor(n, i, n), JSBI.__absoluteAddOne(n, true, n).__trim();
  }
  static bitwiseOr(i, _) {
    var t = Math.max;
    const e = t(i.length, _.length);
    if (!i.sign && !_.sign)
      return JSBI.__absoluteOr(i, _).__trim();
    if (i.sign && _.sign) {
      let t2 = JSBI.__absoluteSubOne(i, e);
      const n2 = JSBI.__absoluteSubOne(_);
      return t2 = JSBI.__absoluteAnd(t2, n2, t2), JSBI.__absoluteAddOne(t2, true, t2).__trim();
    }
    i.sign && ([i, _] = [_, i]);
    let n = JSBI.__absoluteSubOne(_, e);
    return n = JSBI.__absoluteAndNot(n, i, n), JSBI.__absoluteAddOne(n, true, n).__trim();
  }
  static asIntN(_, t) {
    var i = Math.floor;
    if (t.length === 0)
      return t;
    if (_ = i(_), 0 > _)
      throw new RangeError("Invalid value: not (convertible to) a safe integer");
    if (_ === 0)
      return JSBI.__zero();
    if (_ >= JSBI.__kMaxLengthBits)
      return t;
    const e = 0 | (_ + 29) / 30;
    if (t.length < e)
      return t;
    const g = t.__unsignedDigit(e - 1), o = 1 << (_ - 1) % 30;
    if (t.length === e && g < o)
      return t;
    if (!((g & o) === o))
      return JSBI.__truncateToNBits(_, t);
    if (!t.sign)
      return JSBI.__truncateAndSubFromPowerOfTwo(_, t, true);
    if ((g & o - 1) == 0) {
      for (let n = e - 2;0 <= n; n--)
        if (t.__digit(n) !== 0)
          return JSBI.__truncateAndSubFromPowerOfTwo(_, t, false);
      return t.length === e && g === o ? t : JSBI.__truncateToNBits(_, t);
    }
    return JSBI.__truncateAndSubFromPowerOfTwo(_, t, false);
  }
  static asUintN(i, _) {
    var t = Math.floor;
    if (_.length === 0)
      return _;
    if (i = t(i), 0 > i)
      throw new RangeError("Invalid value: not (convertible to) a safe integer");
    if (i === 0)
      return JSBI.__zero();
    if (_.sign) {
      if (i > JSBI.__kMaxLengthBits)
        throw new RangeError("BigInt too big");
      return JSBI.__truncateAndSubFromPowerOfTwo(i, _, false);
    }
    if (i >= JSBI.__kMaxLengthBits)
      return _;
    const e = 0 | (i + 29) / 30;
    if (_.length < e)
      return _;
    const g = i % 30;
    if (_.length == e) {
      if (g === 0)
        return _;
      const i2 = _.__digit(e - 1);
      if (i2 >>> g == 0)
        return _;
    }
    return JSBI.__truncateToNBits(i, _);
  }
  static ADD(i, _) {
    if (i = JSBI.__toPrimitive(i), _ = JSBI.__toPrimitive(_), typeof i == "string")
      return typeof _ != "string" && (_ = _.toString()), i + _;
    if (typeof _ == "string")
      return i.toString() + _;
    if (i = JSBI.__toNumeric(i), _ = JSBI.__toNumeric(_), JSBI.__isBigInt(i) && JSBI.__isBigInt(_))
      return JSBI.add(i, _);
    if (typeof i == "number" && typeof _ == "number")
      return i + _;
    throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
  }
  static LT(i, _) {
    return JSBI.__compare(i, _, 0);
  }
  static LE(i, _) {
    return JSBI.__compare(i, _, 1);
  }
  static GT(i, _) {
    return JSBI.__compare(i, _, 2);
  }
  static GE(i, _) {
    return JSBI.__compare(i, _, 3);
  }
  static EQ(i, _) {
    for (;; ) {
      if (JSBI.__isBigInt(i))
        return JSBI.__isBigInt(_) ? JSBI.equal(i, _) : JSBI.EQ(_, i);
      if (typeof i == "number") {
        if (JSBI.__isBigInt(_))
          return JSBI.__equalToNumber(_, i);
        if (typeof _ != "object")
          return i == _;
        _ = JSBI.__toPrimitive(_);
      } else if (typeof i == "string") {
        if (JSBI.__isBigInt(_))
          return i = JSBI.__fromString(i), i !== null && JSBI.equal(i, _);
        if (typeof _ != "object")
          return i == _;
        _ = JSBI.__toPrimitive(_);
      } else if (typeof i == "boolean") {
        if (JSBI.__isBigInt(_))
          return JSBI.__equalToNumber(_, +i);
        if (typeof _ != "object")
          return i == _;
        _ = JSBI.__toPrimitive(_);
      } else if (typeof i == "symbol") {
        if (JSBI.__isBigInt(_))
          return false;
        if (typeof _ != "object")
          return i == _;
        _ = JSBI.__toPrimitive(_);
      } else if (typeof i == "object") {
        if (typeof _ == "object" && _.constructor !== JSBI)
          return i == _;
        i = JSBI.__toPrimitive(i);
      } else
        return i == _;
    }
  }
  static NE(i, _) {
    return !JSBI.EQ(i, _);
  }
  static __zero() {
    return new JSBI(0, false);
  }
  static __oneDigit(i, _) {
    const t = new JSBI(1, _);
    return t.__setDigit(0, i), t;
  }
  __copy() {
    const _ = new JSBI(this.length, this.sign);
    for (let t = 0;t < this.length; t++)
      _[t] = this[t];
    return _;
  }
  __trim() {
    let i = this.length, _ = this[i - 1];
    for (;_ === 0; )
      i--, _ = this[i - 1], this.pop();
    return i === 0 && (this.sign = false), this;
  }
  __initializeDigits() {
    for (let _ = 0;_ < this.length; _++)
      this[_] = 0;
  }
  static __decideRounding(i, _, t, e) {
    if (0 < _)
      return -1;
    let n;
    if (0 > _)
      n = -_ - 1;
    else {
      if (t === 0)
        return -1;
      t--, e = i.__digit(t), n = 29;
    }
    let g = 1 << n;
    if ((e & g) == 0)
      return -1;
    if (g -= 1, (e & g) != 0)
      return 1;
    for (;0 < t; )
      if (t--, i.__digit(t) !== 0)
        return 1;
    return 0;
  }
  static __fromDouble(i) {
    JSBI.__kBitConversionDouble[0] = i;
    const _ = 2047 & JSBI.__kBitConversionInts[1] >>> 20, t = _ - 1023, e = (0 | t / 30) + 1, n = new JSBI(e, 0 > i);
    let g = 1048575 & JSBI.__kBitConversionInts[1] | 1048576, o = JSBI.__kBitConversionInts[0];
    const s = 20, l = t % 30;
    let r, a = 0;
    if (l < 20) {
      const i2 = s - l;
      a = i2 + 32, r = g >>> i2, g = g << 32 - i2 | o >>> i2, o <<= 32 - i2;
    } else if (l === 20)
      a = 32, r = g, g = o, o = 0;
    else {
      const i2 = l - s;
      a = 32 - i2, r = g << i2 | o >>> 32 - i2, g = o << i2, o = 0;
    }
    n.__setDigit(e - 1, r);
    for (let _2 = e - 2;0 <= _2; _2--)
      0 < a ? (a -= 30, r = g >>> 2, g = g << 30 | o >>> 2, o <<= 30) : r = 0, n.__setDigit(_2, r);
    return n.__trim();
  }
  static __isWhitespace(i) {
    return !!(13 >= i && 9 <= i) || (159 >= i ? i == 32 : 131071 >= i ? i == 160 || i == 5760 : 196607 >= i ? (i &= 131071, 10 >= i || i == 40 || i == 41 || i == 47 || i == 95 || i == 4096) : i == 65279);
  }
  static __fromString(i, _ = 0) {
    let t = 0;
    const e = i.length;
    let n = 0;
    if (n === e)
      return JSBI.__zero();
    let g = i.charCodeAt(n);
    for (;JSBI.__isWhitespace(g); ) {
      if (++n === e)
        return JSBI.__zero();
      g = i.charCodeAt(n);
    }
    if (g === 43) {
      if (++n === e)
        return null;
      g = i.charCodeAt(n), t = 1;
    } else if (g === 45) {
      if (++n === e)
        return null;
      g = i.charCodeAt(n), t = -1;
    }
    if (_ === 0) {
      if (_ = 10, g === 48) {
        if (++n === e)
          return JSBI.__zero();
        if (g = i.charCodeAt(n), g === 88 || g === 120) {
          if (_ = 16, ++n === e)
            return null;
          g = i.charCodeAt(n);
        } else if (g === 79 || g === 111) {
          if (_ = 8, ++n === e)
            return null;
          g = i.charCodeAt(n);
        } else if (g === 66 || g === 98) {
          if (_ = 2, ++n === e)
            return null;
          g = i.charCodeAt(n);
        }
      }
    } else if (_ === 16 && g === 48) {
      if (++n === e)
        return JSBI.__zero();
      if (g = i.charCodeAt(n), g === 88 || g === 120) {
        if (++n === e)
          return null;
        g = i.charCodeAt(n);
      }
    }
    if (t != 0 && _ !== 10)
      return null;
    for (;g === 48; ) {
      if (++n === e)
        return JSBI.__zero();
      g = i.charCodeAt(n);
    }
    const o = e - n;
    let s = JSBI.__kMaxBitsPerChar[_], l = JSBI.__kBitsPerCharTableMultiplier - 1;
    if (o > 1073741824 / s)
      return null;
    const r = s * o + l >>> JSBI.__kBitsPerCharTableShift, a = new JSBI(0 | (r + 29) / 30, false), u = 10 > _ ? _ : 10, h = 10 < _ ? _ - 10 : 0;
    if ((_ & _ - 1) == 0) {
      s >>= JSBI.__kBitsPerCharTableShift;
      const _2 = [], t2 = [];
      let o2 = false;
      do {
        let l2 = 0, r2 = 0;
        for (;; ) {
          let _3;
          if (g - 48 >>> 0 < u)
            _3 = g - 48;
          else if ((32 | g) - 97 >>> 0 < h)
            _3 = (32 | g) - 87;
          else {
            o2 = true;
            break;
          }
          if (r2 += s, l2 = l2 << s | _3, ++n === e) {
            o2 = true;
            break;
          }
          if (g = i.charCodeAt(n), 30 < r2 + s)
            break;
        }
        _2.push(l2), t2.push(r2);
      } while (!o2);
      JSBI.__fillFromParts(a, _2, t2);
    } else {
      a.__initializeDigits();
      let t2 = false, o2 = 0;
      do {
        let r2 = 0, b = 1;
        for (;; ) {
          let s2;
          if (g - 48 >>> 0 < u)
            s2 = g - 48;
          else if ((32 | g) - 97 >>> 0 < h)
            s2 = (32 | g) - 87;
          else {
            t2 = true;
            break;
          }
          const l2 = b * _;
          if (1073741823 < l2)
            break;
          if (b = l2, r2 = r2 * _ + s2, o2++, ++n === e) {
            t2 = true;
            break;
          }
          g = i.charCodeAt(n);
        }
        l = 30 * JSBI.__kBitsPerCharTableMultiplier - 1;
        const D = 0 | (s * o2 + l >>> JSBI.__kBitsPerCharTableShift) / 30;
        a.__inplaceMultiplyAdd(b, r2, D);
      } while (!t2);
    }
    if (n !== e) {
      if (!JSBI.__isWhitespace(g))
        return null;
      for (n++;n < e; n++)
        if (g = i.charCodeAt(n), !JSBI.__isWhitespace(g))
          return null;
    }
    return a.sign = t == -1, a.__trim();
  }
  static __fillFromParts(_, t, e) {
    let n = 0, g = 0, o = 0;
    for (let s = t.length - 1;0 <= s; s--) {
      const i = t[s], l = e[s];
      g |= i << o, o += l, o === 30 ? (_.__setDigit(n++, g), o = 0, g = 0) : 30 < o && (_.__setDigit(n++, 1073741823 & g), o -= 30, g = i >>> l - o);
    }
    if (g !== 0) {
      if (n >= _.length)
        throw new Error("implementation bug");
      _.__setDigit(n++, g);
    }
    for (;n < _.length; n++)
      _.__setDigit(n, 0);
  }
  static __toStringBasePowerOfTwo(_, i) {
    const t = _.length;
    let e = i - 1;
    e = (85 & e >>> 1) + (85 & e), e = (51 & e >>> 2) + (51 & e), e = (15 & e >>> 4) + (15 & e);
    const n = e, g = i - 1, o = _.__digit(t - 1), s = JSBI.__clz30(o);
    let l = 0 | (30 * t - s + n - 1) / n;
    if (_.sign && l++, 268435456 < l)
      throw new Error("string too long");
    const r = Array(l);
    let a = l - 1, u = 0, d = 0;
    for (let e2 = 0;e2 < t - 1; e2++) {
      const i2 = _.__digit(e2), t2 = (u | i2 << d) & g;
      r[a--] = JSBI.__kConversionChars[t2];
      const o2 = n - d;
      for (u = i2 >>> o2, d = 30 - o2;d >= n; )
        r[a--] = JSBI.__kConversionChars[u & g], u >>>= n, d -= n;
    }
    const h = (u | o << d) & g;
    for (r[a--] = JSBI.__kConversionChars[h], u = o >>> n - d;u !== 0; )
      r[a--] = JSBI.__kConversionChars[u & g], u >>>= n;
    if (_.sign && (r[a--] = "-"), a != -1)
      throw new Error("implementation bug");
    return r.join("");
  }
  static __toStringGeneric(_, i, t) {
    const e = _.length;
    if (e === 0)
      return "";
    if (e === 1) {
      let e2 = _.__unsignedDigit(0).toString(i);
      return t === false && _.sign && (e2 = "-" + e2), e2;
    }
    const n = 30 * e - JSBI.__clz30(_.__digit(e - 1)), g = JSBI.__kMaxBitsPerChar[i], o = g - 1;
    let s = n * JSBI.__kBitsPerCharTableMultiplier;
    s += o - 1, s = 0 | s / o;
    const l = s + 1 >> 1, r = JSBI.exponentiate(JSBI.__oneDigit(i, false), JSBI.__oneDigit(l, false));
    let a, u;
    const d = r.__unsignedDigit(0);
    if (r.length === 1 && 32767 >= d) {
      a = new JSBI(_.length, false), a.__initializeDigits();
      let t2 = 0;
      for (let e2 = 2 * _.length - 1;0 <= e2; e2--) {
        const i2 = t2 << 15 | _.__halfDigit(e2);
        a.__setHalfDigit(e2, 0 | i2 / d), t2 = 0 | i2 % d;
      }
      u = t2.toString(i);
    } else {
      const t2 = JSBI.__absoluteDivLarge(_, r, true, true);
      a = t2.quotient;
      const e2 = t2.remainder.__trim();
      u = JSBI.__toStringGeneric(e2, i, true);
    }
    a.__trim();
    let h = JSBI.__toStringGeneric(a, i, true);
    for (;u.length < l; )
      u = "0" + u;
    return t === false && _.sign && (h = "-" + h), h + u;
  }
  static __unequalSign(i) {
    return i ? -1 : 1;
  }
  static __absoluteGreater(i) {
    return i ? -1 : 1;
  }
  static __absoluteLess(i) {
    return i ? 1 : -1;
  }
  static __compareToBigInt(i, _) {
    const t = i.sign;
    if (t !== _.sign)
      return JSBI.__unequalSign(t);
    const e = JSBI.__absoluteCompare(i, _);
    return 0 < e ? JSBI.__absoluteGreater(t) : 0 > e ? JSBI.__absoluteLess(t) : 0;
  }
  static __compareToNumber(i, _) {
    if (JSBI.__isOneDigitInt(_)) {
      const t = i.sign, e = 0 > _;
      if (t !== e)
        return JSBI.__unequalSign(t);
      if (i.length === 0) {
        if (e)
          throw new Error("implementation bug");
        return _ === 0 ? 0 : -1;
      }
      if (1 < i.length)
        return JSBI.__absoluteGreater(t);
      const n = Math.abs(_), g = i.__unsignedDigit(0);
      return g > n ? JSBI.__absoluteGreater(t) : g < n ? JSBI.__absoluteLess(t) : 0;
    }
    return JSBI.__compareToDouble(i, _);
  }
  static __compareToDouble(i, _) {
    if (_ !== _)
      return _;
    if (_ === 1 / 0)
      return -1;
    if (_ === -Infinity)
      return 1;
    const t = i.sign;
    if (t !== 0 > _)
      return JSBI.__unequalSign(t);
    if (_ === 0)
      throw new Error("implementation bug: should be handled elsewhere");
    if (i.length === 0)
      return -1;
    JSBI.__kBitConversionDouble[0] = _;
    const e = 2047 & JSBI.__kBitConversionInts[1] >>> 20;
    if (e == 2047)
      throw new Error("implementation bug: handled elsewhere");
    const n = e - 1023;
    if (0 > n)
      return JSBI.__absoluteGreater(t);
    const g = i.length;
    let o = i.__digit(g - 1);
    const s = JSBI.__clz30(o), l = 30 * g - s, r = n + 1;
    if (l < r)
      return JSBI.__absoluteLess(t);
    if (l > r)
      return JSBI.__absoluteGreater(t);
    let a = 1048576 | 1048575 & JSBI.__kBitConversionInts[1], u = JSBI.__kBitConversionInts[0];
    const d = 20, h = 29 - s;
    if (h !== (0 | (l - 1) % 30))
      throw new Error("implementation bug");
    let m, b = 0;
    if (20 > h) {
      const i2 = d - h;
      b = i2 + 32, m = a >>> i2, a = a << 32 - i2 | u >>> i2, u <<= 32 - i2;
    } else if (h === 20)
      b = 32, m = a, a = u, u = 0;
    else {
      const i2 = h - d;
      b = 32 - i2, m = a << i2 | u >>> 32 - i2, a = u << i2, u = 0;
    }
    if (o >>>= 0, m >>>= 0, o > m)
      return JSBI.__absoluteGreater(t);
    if (o < m)
      return JSBI.__absoluteLess(t);
    for (let e2 = g - 2;0 <= e2; e2--) {
      0 < b ? (b -= 30, m = a >>> 2, a = a << 30 | u >>> 2, u <<= 30) : m = 0;
      const _2 = i.__unsignedDigit(e2);
      if (_2 > m)
        return JSBI.__absoluteGreater(t);
      if (_2 < m)
        return JSBI.__absoluteLess(t);
    }
    if (a !== 0 || u !== 0) {
      if (b === 0)
        throw new Error("implementation bug");
      return JSBI.__absoluteLess(t);
    }
    return 0;
  }
  static __equalToNumber(i, _) {
    var t = Math.abs;
    return JSBI.__isOneDigitInt(_) ? _ === 0 ? i.length === 0 : i.length === 1 && i.sign === 0 > _ && i.__unsignedDigit(0) === t(_) : JSBI.__compareToDouble(i, _) === 0;
  }
  static __comparisonResultToBool(i, _) {
    return _ === 0 ? 0 > i : _ === 1 ? 0 >= i : _ === 2 ? 0 < i : _ === 3 ? 0 <= i : undefined;
  }
  static __compare(i, _, t) {
    if (i = JSBI.__toPrimitive(i), _ = JSBI.__toPrimitive(_), typeof i == "string" && typeof _ == "string")
      switch (t) {
        case 0:
          return i < _;
        case 1:
          return i <= _;
        case 2:
          return i > _;
        case 3:
          return i >= _;
      }
    if (JSBI.__isBigInt(i) && typeof _ == "string")
      return _ = JSBI.__fromString(_), _ !== null && JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(i, _), t);
    if (typeof i == "string" && JSBI.__isBigInt(_))
      return i = JSBI.__fromString(i), i !== null && JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(i, _), t);
    if (i = JSBI.__toNumeric(i), _ = JSBI.__toNumeric(_), JSBI.__isBigInt(i)) {
      if (JSBI.__isBigInt(_))
        return JSBI.__comparisonResultToBool(JSBI.__compareToBigInt(i, _), t);
      if (typeof _ != "number")
        throw new Error("implementation bug");
      return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(i, _), t);
    }
    if (typeof i != "number")
      throw new Error("implementation bug");
    if (JSBI.__isBigInt(_))
      return JSBI.__comparisonResultToBool(JSBI.__compareToNumber(_, i), 2 ^ t);
    if (typeof _ != "number")
      throw new Error("implementation bug");
    return t === 0 ? i < _ : t === 1 ? i <= _ : t === 2 ? i > _ : t === 3 ? i >= _ : undefined;
  }
  __clzmsd() {
    return JSBI.__clz30(this.__digit(this.length - 1));
  }
  static __absoluteAdd(_, t, e) {
    if (_.length < t.length)
      return JSBI.__absoluteAdd(t, _, e);
    if (_.length === 0)
      return _;
    if (t.length === 0)
      return _.sign === e ? _ : JSBI.unaryMinus(_);
    let n = _.length;
    (_.__clzmsd() === 0 || t.length === _.length && t.__clzmsd() === 0) && n++;
    const g = new JSBI(n, e);
    let o = 0, s = 0;
    for (;s < t.length; s++) {
      const i = _.__digit(s) + t.__digit(s) + o;
      o = i >>> 30, g.__setDigit(s, 1073741823 & i);
    }
    for (;s < _.length; s++) {
      const i = _.__digit(s) + o;
      o = i >>> 30, g.__setDigit(s, 1073741823 & i);
    }
    return s < g.length && g.__setDigit(s, o), g.__trim();
  }
  static __absoluteSub(_, t, e) {
    if (_.length === 0)
      return _;
    if (t.length === 0)
      return _.sign === e ? _ : JSBI.unaryMinus(_);
    const n = new JSBI(_.length, e);
    let g = 0, o = 0;
    for (;o < t.length; o++) {
      const i = _.__digit(o) - t.__digit(o) - g;
      g = 1 & i >>> 30, n.__setDigit(o, 1073741823 & i);
    }
    for (;o < _.length; o++) {
      const i = _.__digit(o) - g;
      g = 1 & i >>> 30, n.__setDigit(o, 1073741823 & i);
    }
    return n.__trim();
  }
  static __absoluteAddOne(_, i, t = null) {
    const e = _.length;
    t === null ? t = new JSBI(e, i) : t.sign = i;
    let n = 1;
    for (let g = 0;g < e; g++) {
      const i2 = _.__digit(g) + n;
      n = i2 >>> 30, t.__setDigit(g, 1073741823 & i2);
    }
    return n != 0 && t.__setDigitGrow(e, 1), t;
  }
  static __absoluteSubOne(_, t) {
    const e = _.length;
    t = t || e;
    const n = new JSBI(t, false);
    let g = 1;
    for (let o = 0;o < e; o++) {
      const i = _.__digit(o) - g;
      g = 1 & i >>> 30, n.__setDigit(o, 1073741823 & i);
    }
    if (g != 0)
      throw new Error("implementation bug");
    for (let g2 = e;g2 < t; g2++)
      n.__setDigit(g2, 0);
    return n;
  }
  static __absoluteAnd(_, t, e = null) {
    let n = _.length, g = t.length, o = g;
    if (n < g) {
      o = n;
      const i = _, e2 = n;
      _ = t, n = g, t = i, g = e2;
    }
    let s = o;
    e === null ? e = new JSBI(s, false) : s = e.length;
    let l = 0;
    for (;l < o; l++)
      e.__setDigit(l, _.__digit(l) & t.__digit(l));
    for (;l < s; l++)
      e.__setDigit(l, 0);
    return e;
  }
  static __absoluteAndNot(_, t, e = null) {
    const n = _.length, g = t.length;
    let o = g;
    n < g && (o = n);
    let s = n;
    e === null ? e = new JSBI(s, false) : s = e.length;
    let l = 0;
    for (;l < o; l++)
      e.__setDigit(l, _.__digit(l) & ~t.__digit(l));
    for (;l < n; l++)
      e.__setDigit(l, _.__digit(l));
    for (;l < s; l++)
      e.__setDigit(l, 0);
    return e;
  }
  static __absoluteOr(_, t, e = null) {
    let n = _.length, g = t.length, o = g;
    if (n < g) {
      o = n;
      const i = _, e2 = n;
      _ = t, n = g, t = i, g = e2;
    }
    let s = n;
    e === null ? e = new JSBI(s, false) : s = e.length;
    let l = 0;
    for (;l < o; l++)
      e.__setDigit(l, _.__digit(l) | t.__digit(l));
    for (;l < n; l++)
      e.__setDigit(l, _.__digit(l));
    for (;l < s; l++)
      e.__setDigit(l, 0);
    return e;
  }
  static __absoluteXor(_, t, e = null) {
    let n = _.length, g = t.length, o = g;
    if (n < g) {
      o = n;
      const i = _, e2 = n;
      _ = t, n = g, t = i, g = e2;
    }
    let s = n;
    e === null ? e = new JSBI(s, false) : s = e.length;
    let l = 0;
    for (;l < o; l++)
      e.__setDigit(l, _.__digit(l) ^ t.__digit(l));
    for (;l < n; l++)
      e.__setDigit(l, _.__digit(l));
    for (;l < s; l++)
      e.__setDigit(l, 0);
    return e;
  }
  static __absoluteCompare(_, t) {
    const e = _.length - t.length;
    if (e != 0)
      return e;
    let n = _.length - 1;
    for (;0 <= n && _.__digit(n) === t.__digit(n); )
      n--;
    return 0 > n ? 0 : _.__unsignedDigit(n) > t.__unsignedDigit(n) ? 1 : -1;
  }
  static __multiplyAccumulate(_, t, e, n) {
    if (t === 0)
      return;
    const g = 32767 & t, o = t >>> 15;
    let s = 0, l = 0;
    for (let r, a = 0;a < _.length; a++, n++) {
      r = e.__digit(n);
      const i = _.__digit(a), t2 = 32767 & i, u = i >>> 15, d = JSBI.__imul(t2, g), h = JSBI.__imul(t2, o), m = JSBI.__imul(u, g), b = JSBI.__imul(u, o);
      r += l + d + s, s = r >>> 30, r &= 1073741823, r += ((32767 & h) << 15) + ((32767 & m) << 15), s += r >>> 30, l = b + (h >>> 15) + (m >>> 15), e.__setDigit(n, 1073741823 & r);
    }
    for (;s != 0 || l !== 0; n++) {
      let i = e.__digit(n);
      i += s + l, l = 0, s = i >>> 30, e.__setDigit(n, 1073741823 & i);
    }
  }
  static __internalMultiplyAdd(_, t, e, g, o) {
    let s = e, l = 0;
    for (let n = 0;n < g; n++) {
      const i = _.__digit(n), e2 = JSBI.__imul(32767 & i, t), g2 = JSBI.__imul(i >>> 15, t), a = e2 + ((32767 & g2) << 15) + l + s;
      s = a >>> 30, l = g2 >>> 15, o.__setDigit(n, 1073741823 & a);
    }
    if (o.length > g)
      for (o.__setDigit(g++, s + l);g < o.length; )
        o.__setDigit(g++, 0);
    else if (s + l !== 0)
      throw new Error("implementation bug");
  }
  __inplaceMultiplyAdd(i, _, t) {
    t > this.length && (t = this.length);
    const e = 32767 & i, n = i >>> 15;
    let g = 0, o = _;
    for (let s = 0;s < t; s++) {
      const i2 = this.__digit(s), _2 = 32767 & i2, t2 = i2 >>> 15, l = JSBI.__imul(_2, e), r = JSBI.__imul(_2, n), a = JSBI.__imul(t2, e), u = JSBI.__imul(t2, n);
      let d = o + l + g;
      g = d >>> 30, d &= 1073741823, d += ((32767 & r) << 15) + ((32767 & a) << 15), g += d >>> 30, o = u + (r >>> 15) + (a >>> 15), this.__setDigit(s, 1073741823 & d);
    }
    if (g != 0 || o !== 0)
      throw new Error("implementation bug");
  }
  static __absoluteDivSmall(_, t, e = null) {
    e === null && (e = new JSBI(_.length, false));
    let n = 0;
    for (let g, o = 2 * _.length - 1;0 <= o; o -= 2) {
      g = (n << 15 | _.__halfDigit(o)) >>> 0;
      const i = 0 | g / t;
      n = 0 | g % t, g = (n << 15 | _.__halfDigit(o - 1)) >>> 0;
      const s = 0 | g / t;
      n = 0 | g % t, e.__setDigit(o >>> 1, i << 15 | s);
    }
    return e;
  }
  static __absoluteModSmall(_, t) {
    let e = 0;
    for (let n = 2 * _.length - 1;0 <= n; n--) {
      const i = (e << 15 | _.__halfDigit(n)) >>> 0;
      e = 0 | i % t;
    }
    return e;
  }
  static __absoluteDivLarge(i, _, t, e) {
    const g = _.__halfDigitLength(), n = _.length, o = i.__halfDigitLength() - g;
    let s = null;
    t && (s = new JSBI(o + 2 >>> 1, false), s.__initializeDigits());
    const l = new JSBI(g + 2 >>> 1, false);
    l.__initializeDigits();
    const r = JSBI.__clz15(_.__halfDigit(g - 1));
    0 < r && (_ = JSBI.__specialLeftShift(_, r, 0));
    const a = JSBI.__specialLeftShift(i, r, 1), u = _.__halfDigit(g - 1);
    let d = 0;
    for (let r2, h = o;0 <= h; h--) {
      r2 = 32767;
      const i2 = a.__halfDigit(h + g);
      if (i2 !== u) {
        const t2 = (i2 << 15 | a.__halfDigit(h + g - 1)) >>> 0;
        r2 = 0 | t2 / u;
        let e3 = 0 | t2 % u;
        const n2 = _.__halfDigit(g - 2), o2 = a.__halfDigit(h + g - 2);
        for (;JSBI.__imul(r2, n2) >>> 0 > (e3 << 16 | o2) >>> 0 && (r2--, e3 += u, !(32767 < e3)); )
          ;
      }
      JSBI.__internalMultiplyAdd(_, r2, 0, n, l);
      let e2 = a.__inplaceSub(l, h, g + 1);
      e2 !== 0 && (e2 = a.__inplaceAdd(_, h, g), a.__setHalfDigit(h + g, 32767 & a.__halfDigit(h + g) + e2), r2--), t && (1 & h ? d = r2 << 15 : s.__setDigit(h >>> 1, d | r2));
    }
    if (e)
      return a.__inplaceRightShift(r), t ? { quotient: s, remainder: a } : a;
    if (t)
      return s;
    throw new Error("unreachable");
  }
  static __clz15(i) {
    return JSBI.__clz30(i) - 15;
  }
  __inplaceAdd(_, t, e) {
    let n = 0;
    for (let g = 0;g < e; g++) {
      const i = this.__halfDigit(t + g) + _.__halfDigit(g) + n;
      n = i >>> 15, this.__setHalfDigit(t + g, 32767 & i);
    }
    return n;
  }
  __inplaceSub(_, t, e) {
    let n = 0;
    if (1 & t) {
      t >>= 1;
      let g = this.__digit(t), o = 32767 & g, s = 0;
      for (;s < e - 1 >>> 1; s++) {
        const i2 = _.__digit(s), e2 = (g >>> 15) - (32767 & i2) - n;
        n = 1 & e2 >>> 15, this.__setDigit(t + s, (32767 & e2) << 15 | 32767 & o), g = this.__digit(t + s + 1), o = (32767 & g) - (i2 >>> 15) - n, n = 1 & o >>> 15;
      }
      const i = _.__digit(s), l = (g >>> 15) - (32767 & i) - n;
      n = 1 & l >>> 15, this.__setDigit(t + s, (32767 & l) << 15 | 32767 & o);
      if (t + s + 1 >= this.length)
        throw new RangeError("out of bounds");
      (1 & e) == 0 && (g = this.__digit(t + s + 1), o = (32767 & g) - (i >>> 15) - n, n = 1 & o >>> 15, this.__setDigit(t + _.length, 1073709056 & g | 32767 & o));
    } else {
      t >>= 1;
      let g = 0;
      for (;g < _.length - 1; g++) {
        const i2 = this.__digit(t + g), e2 = _.__digit(g), o2 = (32767 & i2) - (32767 & e2) - n;
        n = 1 & o2 >>> 15;
        const s2 = (i2 >>> 15) - (e2 >>> 15) - n;
        n = 1 & s2 >>> 15, this.__setDigit(t + g, (32767 & s2) << 15 | 32767 & o2);
      }
      const i = this.__digit(t + g), o = _.__digit(g), s = (32767 & i) - (32767 & o) - n;
      n = 1 & s >>> 15;
      let l = 0;
      (1 & e) == 0 && (l = (i >>> 15) - (o >>> 15) - n, n = 1 & l >>> 15), this.__setDigit(t + g, (32767 & l) << 15 | 32767 & s);
    }
    return n;
  }
  __inplaceRightShift(_) {
    if (_ === 0)
      return;
    let t = this.__digit(0) >>> _;
    const e = this.length - 1;
    for (let n = 0;n < e; n++) {
      const i = this.__digit(n + 1);
      this.__setDigit(n, 1073741823 & i << 30 - _ | t), t = i >>> _;
    }
    this.__setDigit(e, t);
  }
  static __specialLeftShift(_, t, e) {
    const g = _.length, n = new JSBI(g + e, false);
    if (t === 0) {
      for (let t2 = 0;t2 < g; t2++)
        n.__setDigit(t2, _.__digit(t2));
      return 0 < e && n.__setDigit(g, 0), n;
    }
    let o = 0;
    for (let s = 0;s < g; s++) {
      const i = _.__digit(s);
      n.__setDigit(s, 1073741823 & i << t | o), o = i >>> 30 - t;
    }
    return 0 < e && n.__setDigit(g, o), n;
  }
  static __leftShiftByAbsolute(_, i) {
    const t = JSBI.__toShiftAmount(i);
    if (0 > t)
      throw new RangeError("BigInt too big");
    const e = 0 | t / 30, n = t % 30, g = _.length, o = n !== 0 && _.__digit(g - 1) >>> 30 - n != 0, s = g + e + (o ? 1 : 0), l = new JSBI(s, _.sign);
    if (n === 0) {
      let t2 = 0;
      for (;t2 < e; t2++)
        l.__setDigit(t2, 0);
      for (;t2 < s; t2++)
        l.__setDigit(t2, _.__digit(t2 - e));
    } else {
      let t2 = 0;
      for (let _2 = 0;_2 < e; _2++)
        l.__setDigit(_2, 0);
      for (let o2 = 0;o2 < g; o2++) {
        const i2 = _.__digit(o2);
        l.__setDigit(o2 + e, 1073741823 & i2 << n | t2), t2 = i2 >>> 30 - n;
      }
      if (o)
        l.__setDigit(g + e, t2);
      else if (t2 !== 0)
        throw new Error("implementation bug");
    }
    return l.__trim();
  }
  static __rightShiftByAbsolute(_, i) {
    const { length: t, sign: e } = _, n = JSBI.__toShiftAmount(i);
    if (0 > n)
      return JSBI.__rightShiftByMaximum(e);
    const g = 0 | n / 30, o = n % 30;
    let s = t - g;
    if (0 >= s)
      return JSBI.__rightShiftByMaximum(e);
    let l = false;
    if (e) {
      if ((_.__digit(g) & (1 << o) - 1) != 0)
        l = true;
      else
        for (let t2 = 0;t2 < g; t2++)
          if (_.__digit(t2) !== 0) {
            l = true;
            break;
          }
    }
    if (l && o === 0) {
      const i2 = _.__digit(t - 1);
      ~i2 == 0 && s++;
    }
    let r = new JSBI(s, e);
    if (o === 0) {
      r.__setDigit(s - 1, 0);
      for (let e2 = g;e2 < t; e2++)
        r.__setDigit(e2 - g, _.__digit(e2));
    } else {
      let e2 = _.__digit(g) >>> o;
      const n2 = t - g - 1;
      for (let t2 = 0;t2 < n2; t2++) {
        const i2 = _.__digit(t2 + g + 1);
        r.__setDigit(t2, 1073741823 & i2 << 30 - o | e2), e2 = i2 >>> o;
      }
      r.__setDigit(n2, e2);
    }
    return l && (r = JSBI.__absoluteAddOne(r, true, r)), r.__trim();
  }
  static __rightShiftByMaximum(i) {
    return i ? JSBI.__oneDigit(1, true) : JSBI.__zero();
  }
  static __toShiftAmount(i) {
    if (1 < i.length)
      return -1;
    const _ = i.__unsignedDigit(0);
    return _ > JSBI.__kMaxLengthBits ? -1 : _;
  }
  static __toPrimitive(i, _ = "default") {
    if (typeof i != "object")
      return i;
    if (i.constructor === JSBI)
      return i;
    if (typeof Symbol != "undefined" && typeof Symbol.toPrimitive == "symbol") {
      const t2 = i[Symbol.toPrimitive];
      if (t2) {
        const i2 = t2(_);
        if (typeof i2 != "object")
          return i2;
        throw new TypeError("Cannot convert object to primitive value");
      }
    }
    const t = i.valueOf;
    if (t) {
      const _2 = t.call(i);
      if (typeof _2 != "object")
        return _2;
    }
    const e = i.toString;
    if (e) {
      const _2 = e.call(i);
      if (typeof _2 != "object")
        return _2;
    }
    throw new TypeError("Cannot convert object to primitive value");
  }
  static __toNumeric(i) {
    return JSBI.__isBigInt(i) ? i : +i;
  }
  static __isBigInt(i) {
    return typeof i == "object" && i !== null && i.constructor === JSBI;
  }
  static __truncateToNBits(i, _) {
    const t = 0 | (i + 29) / 30, e = new JSBI(t, _.sign), n = t - 1;
    for (let t2 = 0;t2 < n; t2++)
      e.__setDigit(t2, _.__digit(t2));
    let g = _.__digit(n);
    if (i % 30 != 0) {
      const _2 = 32 - i % 30;
      g = g << _2 >>> _2;
    }
    return e.__setDigit(n, g), e.__trim();
  }
  static __truncateAndSubFromPowerOfTwo(_, t, e) {
    var n = Math.min;
    const g = 0 | (_ + 29) / 30, o = new JSBI(g, e);
    let s = 0;
    const l = g - 1;
    let a = 0;
    for (const i = n(l, t.length);s < i; s++) {
      const i2 = 0 - t.__digit(s) - a;
      a = 1 & i2 >>> 30, o.__setDigit(s, 1073741823 & i2);
    }
    for (;s < l; s++)
      o.__setDigit(s, 0 | 1073741823 & -a);
    let u = l < t.length ? t.__digit(l) : 0;
    const d = _ % 30;
    let h;
    if (d == 0)
      h = 0 - u - a, h &= 1073741823;
    else {
      const i = 32 - d;
      u = u << i >>> i;
      const _2 = 1 << 32 - i;
      h = _2 - u - a, h &= _2 - 1;
    }
    return o.__setDigit(l, h), o.__trim();
  }
  __digit(_) {
    return this[_];
  }
  __unsignedDigit(_) {
    return this[_] >>> 0;
  }
  __setDigit(_, i) {
    this[_] = 0 | i;
  }
  __setDigitGrow(_, i) {
    this[_] = 0 | i;
  }
  __halfDigitLength() {
    const i = this.length;
    return 32767 >= this.__unsignedDigit(i - 1) ? 2 * i - 1 : 2 * i;
  }
  __halfDigit(_) {
    return 32767 & this[_ >>> 1] >>> 15 * (1 & _);
  }
  __setHalfDigit(_, i) {
    const t = _ >>> 1, e = this.__digit(t), n = 1 & _ ? 32767 & e | i << 15 : 1073709056 & e | 32767 & i;
    this.__setDigit(t, n);
  }
  static __digitPow(i, _) {
    let t = 1;
    for (;0 < _; )
      1 & _ && (t *= i), _ >>>= 1, i *= i;
    return t;
  }
  static __isOneDigitInt(i) {
    return (1073741823 & i) === i;
  }
}
JSBI.__kMaxLength = 33554432, JSBI.__kMaxLengthBits = JSBI.__kMaxLength << 5, JSBI.__kMaxBitsPerChar = [0, 0, 32, 51, 64, 75, 83, 90, 96, 102, 107, 111, 115, 119, 122, 126, 128, 131, 134, 136, 139, 141, 143, 145, 147, 149, 151, 153, 154, 156, 158, 159, 160, 162, 163, 165, 166], JSBI.__kBitsPerCharTableShift = 5, JSBI.__kBitsPerCharTableMultiplier = 1 << JSBI.__kBitsPerCharTableShift, JSBI.__kConversionChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], JSBI.__kBitConversionBuffer = new ArrayBuffer(8), JSBI.__kBitConversionDouble = new Float64Array(JSBI.__kBitConversionBuffer), JSBI.__kBitConversionInts = new Int32Array(JSBI.__kBitConversionBuffer), JSBI.__clz30 = Math.clz32 ? function(i) {
  return Math.clz32(i) - 2;
} : function(i) {
  return i === 0 ? 30 : 0 | 29 - (0 | Math.log(i >>> 0) / Math.LN2);
}, JSBI.__imul = Math.imul || function(i, _) {
  return 0 | i * _;
};
var jsbi_default = JSBI;

// node_modules/@uniswap/sdk-core/dist/esm/src/constants.js
var TradeType;
(function(TradeType2) {
  TradeType2[TradeType2["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType2[TradeType2["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(TradeType || (TradeType = {}));
var Rounding;
(function(Rounding2) {
  Rounding2[Rounding2["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding2[Rounding2["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding2[Rounding2["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding || (Rounding = {}));
var MaxUint256 = jsbi_default.BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

// node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var isProduction = false;
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix);
  }
  var provided = typeof message === "function" ? message() : message;
  var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
  throw new Error(value);
}

// node_modules/@uniswap/sdk-core/dist/esm/src/entities/baseCurrency.js
class BaseCurrency {
  constructor(chainId, decimals, symbol, name) {
    invariant(Number.isSafeInteger(chainId), "CHAIN_ID");
    invariant(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), "DECIMALS");
    this.chainId = chainId;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }
}

// node_modules/@ethersproject/bignumber/lib.esm/bignumber.js
var import_bn = __toESM(require_bn(), 1);

// node_modules/@ethersproject/logger/lib.esm/_version.js
var version4 = "logger/5.8.0";

// node_modules/@ethersproject/logger/lib.esm/index.js
var _permanentCensorErrors = false;
var _censorErrors = false;
var LogLevels = { debug: 1, default: 2, info: 2, warning: 3, error: 4, off: 5 };
var _logLevel = LogLevels["default"];
var _globalLogger = null;
function _checkNormalize() {
  try {
    const missing = [];
    ["NFD", "NFC", "NFKD", "NFKC"].forEach((form) => {
      try {
        if ("test".normalize(form) !== "test") {
          throw new Error("bad normalize");
        }
      } catch (error) {
        missing.push(form);
      }
    });
    if (missing.length) {
      throw new Error("missing " + missing.join(", "));
    }
    if (String.fromCharCode(233).normalize("NFD") !== String.fromCharCode(101, 769)) {
      throw new Error("broken implementation");
    }
  } catch (error) {
    return error.message;
  }
  return null;
}
var _normalizeError = _checkNormalize();
var LogLevel;
(function(LogLevel2) {
  LogLevel2["DEBUG"] = "DEBUG";
  LogLevel2["INFO"] = "INFO";
  LogLevel2["WARNING"] = "WARNING";
  LogLevel2["ERROR"] = "ERROR";
  LogLevel2["OFF"] = "OFF";
})(LogLevel || (LogLevel = {}));
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
  ErrorCode2["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
  ErrorCode2["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
  ErrorCode2["NETWORK_ERROR"] = "NETWORK_ERROR";
  ErrorCode2["SERVER_ERROR"] = "SERVER_ERROR";
  ErrorCode2["TIMEOUT"] = "TIMEOUT";
  ErrorCode2["BUFFER_OVERRUN"] = "BUFFER_OVERRUN";
  ErrorCode2["NUMERIC_FAULT"] = "NUMERIC_FAULT";
  ErrorCode2["MISSING_NEW"] = "MISSING_NEW";
  ErrorCode2["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
  ErrorCode2["MISSING_ARGUMENT"] = "MISSING_ARGUMENT";
  ErrorCode2["UNEXPECTED_ARGUMENT"] = "UNEXPECTED_ARGUMENT";
  ErrorCode2["CALL_EXCEPTION"] = "CALL_EXCEPTION";
  ErrorCode2["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
  ErrorCode2["NONCE_EXPIRED"] = "NONCE_EXPIRED";
  ErrorCode2["REPLACEMENT_UNDERPRICED"] = "REPLACEMENT_UNDERPRICED";
  ErrorCode2["UNPREDICTABLE_GAS_LIMIT"] = "UNPREDICTABLE_GAS_LIMIT";
  ErrorCode2["TRANSACTION_REPLACED"] = "TRANSACTION_REPLACED";
  ErrorCode2["ACTION_REJECTED"] = "ACTION_REJECTED";
})(ErrorCode || (ErrorCode = {}));
var HEX = "0123456789abcdef";

class Logger {
  constructor(version5) {
    Object.defineProperty(this, "version", {
      enumerable: true,
      value: version5,
      writable: false
    });
  }
  _log(logLevel, args) {
    const level = logLevel.toLowerCase();
    if (LogLevels[level] == null) {
      this.throwArgumentError("invalid log level name", "logLevel", logLevel);
    }
    if (_logLevel > LogLevels[level]) {
      return;
    }
    console.log.apply(console, args);
  }
  debug(...args) {
    this._log(Logger.levels.DEBUG, args);
  }
  info(...args) {
    this._log(Logger.levels.INFO, args);
  }
  warn(...args) {
    this._log(Logger.levels.WARNING, args);
  }
  makeError(message, code, params) {
    if (_censorErrors) {
      return this.makeError("censored error", code, {});
    }
    if (!code) {
      code = Logger.errors.UNKNOWN_ERROR;
    }
    if (!params) {
      params = {};
    }
    const messageDetails = [];
    Object.keys(params).forEach((key) => {
      const value = params[key];
      try {
        if (value instanceof Uint8Array) {
          let hex = "";
          for (let i = 0;i < value.length; i++) {
            hex += HEX[value[i] >> 4];
            hex += HEX[value[i] & 15];
          }
          messageDetails.push(key + "=Uint8Array(0x" + hex + ")");
        } else {
          messageDetails.push(key + "=" + JSON.stringify(value));
        }
      } catch (error2) {
        messageDetails.push(key + "=" + JSON.stringify(params[key].toString()));
      }
    });
    messageDetails.push(`code=${code}`);
    messageDetails.push(`version=${this.version}`);
    const reason = message;
    let url = "";
    switch (code) {
      case ErrorCode.NUMERIC_FAULT: {
        url = "NUMERIC_FAULT";
        const fault = message;
        switch (fault) {
          case "overflow":
          case "underflow":
          case "division-by-zero":
            url += "-" + fault;
            break;
          case "negative-power":
          case "negative-width":
            url += "-unsupported";
            break;
          case "unbound-bitwise-result":
            url += "-unbound-result";
            break;
        }
        break;
      }
      case ErrorCode.CALL_EXCEPTION:
      case ErrorCode.INSUFFICIENT_FUNDS:
      case ErrorCode.MISSING_NEW:
      case ErrorCode.NONCE_EXPIRED:
      case ErrorCode.REPLACEMENT_UNDERPRICED:
      case ErrorCode.TRANSACTION_REPLACED:
      case ErrorCode.UNPREDICTABLE_GAS_LIMIT:
        url = code;
        break;
    }
    if (url) {
      message += " [ See: https://links.ethers.org/v5-errors-" + url + " ]";
    }
    if (messageDetails.length) {
      message += " (" + messageDetails.join(", ") + ")";
    }
    const error = new Error(message);
    error.reason = reason;
    error.code = code;
    Object.keys(params).forEach(function(key) {
      error[key] = params[key];
    });
    return error;
  }
  throwError(message, code, params) {
    throw this.makeError(message, code, params);
  }
  throwArgumentError(message, name, value) {
    return this.throwError(message, Logger.errors.INVALID_ARGUMENT, {
      argument: name,
      value
    });
  }
  assert(condition, message, code, params) {
    if (!!condition) {
      return;
    }
    this.throwError(message, code, params);
  }
  assertArgument(condition, message, name, value) {
    if (!!condition) {
      return;
    }
    this.throwArgumentError(message, name, value);
  }
  checkNormalize(message) {
    if (message == null) {
      message = "platform missing String.prototype.normalize";
    }
    if (_normalizeError) {
      this.throwError("platform missing String.prototype.normalize", Logger.errors.UNSUPPORTED_OPERATION, {
        operation: "String.prototype.normalize",
        form: _normalizeError
      });
    }
  }
  checkSafeUint53(value, message) {
    if (typeof value !== "number") {
      return;
    }
    if (message == null) {
      message = "value not safe";
    }
    if (value < 0 || value >= 9007199254740991) {
      this.throwError(message, Logger.errors.NUMERIC_FAULT, {
        operation: "checkSafeInteger",
        fault: "out-of-safe-range",
        value
      });
    }
    if (value % 1) {
      this.throwError(message, Logger.errors.NUMERIC_FAULT, {
        operation: "checkSafeInteger",
        fault: "non-integer",
        value
      });
    }
  }
  checkArgumentCount(count, expectedCount, message) {
    if (message) {
      message = ": " + message;
    } else {
      message = "";
    }
    if (count < expectedCount) {
      this.throwError("missing argument" + message, Logger.errors.MISSING_ARGUMENT, {
        count,
        expectedCount
      });
    }
    if (count > expectedCount) {
      this.throwError("too many arguments" + message, Logger.errors.UNEXPECTED_ARGUMENT, {
        count,
        expectedCount
      });
    }
  }
  checkNew(target, kind) {
    if (target === Object || target == null) {
      this.throwError("missing new", Logger.errors.MISSING_NEW, { name: kind.name });
    }
  }
  checkAbstract(target, kind) {
    if (target === kind) {
      this.throwError("cannot instantiate abstract class " + JSON.stringify(kind.name) + " directly; use a sub-class", Logger.errors.UNSUPPORTED_OPERATION, { name: target.name, operation: "new" });
    } else if (target === Object || target == null) {
      this.throwError("missing new", Logger.errors.MISSING_NEW, { name: kind.name });
    }
  }
  static globalLogger() {
    if (!_globalLogger) {
      _globalLogger = new Logger(version4);
    }
    return _globalLogger;
  }
  static setCensorship(censorship, permanent) {
    if (!censorship && permanent) {
      this.globalLogger().throwError("cannot permanently disable censorship", Logger.errors.UNSUPPORTED_OPERATION, {
        operation: "setCensorship"
      });
    }
    if (_permanentCensorErrors) {
      if (!censorship) {
        return;
      }
      this.globalLogger().throwError("error censorship permanent", Logger.errors.UNSUPPORTED_OPERATION, {
        operation: "setCensorship"
      });
    }
    _censorErrors = !!censorship;
    _permanentCensorErrors = !!permanent;
  }
  static setLogLevel(logLevel) {
    const level = LogLevels[logLevel.toLowerCase()];
    if (level == null) {
      Logger.globalLogger().warn("invalid log level - " + logLevel);
      return;
    }
    _logLevel = level;
  }
  static from(version5) {
    return new Logger(version5);
  }
}
Logger.errors = ErrorCode;
Logger.levels = LogLevel;

// node_modules/@ethersproject/bytes/lib.esm/_version.js
var version5 = "bytes/5.8.0";

// node_modules/@ethersproject/bytes/lib.esm/index.js
var logger = new Logger(version5);
function isHexable(value) {
  return !!value.toHexString;
}
function addSlice(array) {
  if (array.slice) {
    return array;
  }
  array.slice = function() {
    const args = Array.prototype.slice.call(arguments);
    return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
  };
  return array;
}
function isInteger(value) {
  return typeof value === "number" && value == value && value % 1 === 0;
}
function isBytes5(value) {
  if (value == null) {
    return false;
  }
  if (value.constructor === Uint8Array) {
    return true;
  }
  if (typeof value === "string") {
    return false;
  }
  if (!isInteger(value.length) || value.length < 0) {
    return false;
  }
  for (let i = 0;i < value.length; i++) {
    const v = value[i];
    if (!isInteger(v) || v < 0 || v >= 256) {
      return false;
    }
  }
  return true;
}
function arrayify(value, options) {
  if (!options) {
    options = {};
  }
  if (typeof value === "number") {
    logger.checkSafeUint53(value, "invalid arrayify value");
    const result = [];
    while (value) {
      result.unshift(value & 255);
      value = parseInt(String(value / 256));
    }
    if (result.length === 0) {
      result.push(0);
    }
    return addSlice(new Uint8Array(result));
  }
  if (options.allowMissingPrefix && typeof value === "string" && value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }
  if (isHexable(value)) {
    value = value.toHexString();
  }
  if (isHexString(value)) {
    let hex = value.substring(2);
    if (hex.length % 2) {
      if (options.hexPad === "left") {
        hex = "0" + hex;
      } else if (options.hexPad === "right") {
        hex += "0";
      } else {
        logger.throwArgumentError("hex data is odd-length", "value", value);
      }
    }
    const result = [];
    for (let i = 0;i < hex.length; i += 2) {
      result.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return addSlice(new Uint8Array(result));
  }
  if (isBytes5(value)) {
    return addSlice(new Uint8Array(value));
  }
  return logger.throwArgumentError("invalid arrayify value", "value", value);
}
function isHexString(value, length) {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}
var HexCharacters = "0123456789abcdef";
function hexlify(value, options) {
  if (!options) {
    options = {};
  }
  if (typeof value === "number") {
    logger.checkSafeUint53(value, "invalid hexlify value");
    let hex = "";
    while (value) {
      hex = HexCharacters[value & 15] + hex;
      value = Math.floor(value / 16);
    }
    if (hex.length) {
      if (hex.length % 2) {
        hex = "0" + hex;
      }
      return "0x" + hex;
    }
    return "0x00";
  }
  if (typeof value === "bigint") {
    value = value.toString(16);
    if (value.length % 2) {
      return "0x0" + value;
    }
    return "0x" + value;
  }
  if (options.allowMissingPrefix && typeof value === "string" && value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }
  if (isHexable(value)) {
    return value.toHexString();
  }
  if (isHexString(value)) {
    if (value.length % 2) {
      if (options.hexPad === "left") {
        value = "0x0" + value.substring(2);
      } else if (options.hexPad === "right") {
        value += "0";
      } else {
        logger.throwArgumentError("hex data is odd-length", "value", value);
      }
    }
    return value.toLowerCase();
  }
  if (isBytes5(value)) {
    let result = "0x";
    for (let i = 0;i < value.length; i++) {
      let v = value[i];
      result += HexCharacters[(v & 240) >> 4] + HexCharacters[v & 15];
    }
    return result;
  }
  return logger.throwArgumentError("invalid hexlify value", "value", value);
}

// node_modules/@ethersproject/bignumber/lib.esm/_version.js
var version6 = "bignumber/5.8.0";

// node_modules/@ethersproject/bignumber/lib.esm/bignumber.js
var BN = import_bn.default.BN;
var logger2 = new Logger(version6);
var _constructorGuard = {};
var MAX_SAFE = 9007199254740991;
var _warnedToStringRadix = false;

class BigNumber {
  constructor(constructorGuard, hex) {
    if (constructorGuard !== _constructorGuard) {
      logger2.throwError("cannot call constructor directly; use BigNumber.from", Logger.errors.UNSUPPORTED_OPERATION, {
        operation: "new (BigNumber)"
      });
    }
    this._hex = hex;
    this._isBigNumber = true;
    Object.freeze(this);
  }
  fromTwos(value) {
    return toBigNumber(toBN(this).fromTwos(value));
  }
  toTwos(value) {
    return toBigNumber(toBN(this).toTwos(value));
  }
  abs() {
    if (this._hex[0] === "-") {
      return BigNumber.from(this._hex.substring(1));
    }
    return this;
  }
  add(other) {
    return toBigNumber(toBN(this).add(toBN(other)));
  }
  sub(other) {
    return toBigNumber(toBN(this).sub(toBN(other)));
  }
  div(other) {
    const o = BigNumber.from(other);
    if (o.isZero()) {
      throwFault("division-by-zero", "div");
    }
    return toBigNumber(toBN(this).div(toBN(other)));
  }
  mul(other) {
    return toBigNumber(toBN(this).mul(toBN(other)));
  }
  mod(other) {
    const value = toBN(other);
    if (value.isNeg()) {
      throwFault("division-by-zero", "mod");
    }
    return toBigNumber(toBN(this).umod(value));
  }
  pow(other) {
    const value = toBN(other);
    if (value.isNeg()) {
      throwFault("negative-power", "pow");
    }
    return toBigNumber(toBN(this).pow(value));
  }
  and(other) {
    const value = toBN(other);
    if (this.isNegative() || value.isNeg()) {
      throwFault("unbound-bitwise-result", "and");
    }
    return toBigNumber(toBN(this).and(value));
  }
  or(other) {
    const value = toBN(other);
    if (this.isNegative() || value.isNeg()) {
      throwFault("unbound-bitwise-result", "or");
    }
    return toBigNumber(toBN(this).or(value));
  }
  xor(other) {
    const value = toBN(other);
    if (this.isNegative() || value.isNeg()) {
      throwFault("unbound-bitwise-result", "xor");
    }
    return toBigNumber(toBN(this).xor(value));
  }
  mask(value) {
    if (this.isNegative() || value < 0) {
      throwFault("negative-width", "mask");
    }
    return toBigNumber(toBN(this).maskn(value));
  }
  shl(value) {
    if (this.isNegative() || value < 0) {
      throwFault("negative-width", "shl");
    }
    return toBigNumber(toBN(this).shln(value));
  }
  shr(value) {
    if (this.isNegative() || value < 0) {
      throwFault("negative-width", "shr");
    }
    return toBigNumber(toBN(this).shrn(value));
  }
  eq(other) {
    return toBN(this).eq(toBN(other));
  }
  lt(other) {
    return toBN(this).lt(toBN(other));
  }
  lte(other) {
    return toBN(this).lte(toBN(other));
  }
  gt(other) {
    return toBN(this).gt(toBN(other));
  }
  gte(other) {
    return toBN(this).gte(toBN(other));
  }
  isNegative() {
    return this._hex[0] === "-";
  }
  isZero() {
    return toBN(this).isZero();
  }
  toNumber() {
    try {
      return toBN(this).toNumber();
    } catch (error) {
      throwFault("overflow", "toNumber", this.toString());
    }
    return null;
  }
  toBigInt() {
    try {
      return BigInt(this.toString());
    } catch (e) {}
    return logger2.throwError("this platform does not support BigInt", Logger.errors.UNSUPPORTED_OPERATION, {
      value: this.toString()
    });
  }
  toString() {
    if (arguments.length > 0) {
      if (arguments[0] === 10) {
        if (!_warnedToStringRadix) {
          _warnedToStringRadix = true;
          logger2.warn("BigNumber.toString does not accept any parameters; base-10 is assumed");
        }
      } else if (arguments[0] === 16) {
        logger2.throwError("BigNumber.toString does not accept any parameters; use bigNumber.toHexString()", Logger.errors.UNEXPECTED_ARGUMENT, {});
      } else {
        logger2.throwError("BigNumber.toString does not accept parameters", Logger.errors.UNEXPECTED_ARGUMENT, {});
      }
    }
    return toBN(this).toString(10);
  }
  toHexString() {
    return this._hex;
  }
  toJSON(key) {
    return { type: "BigNumber", hex: this.toHexString() };
  }
  static from(value) {
    if (value instanceof BigNumber) {
      return value;
    }
    if (typeof value === "string") {
      if (value.match(/^-?0x[0-9a-f]+$/i)) {
        return new BigNumber(_constructorGuard, toHex5(value));
      }
      if (value.match(/^-?[0-9]+$/)) {
        return new BigNumber(_constructorGuard, toHex5(new BN(value)));
      }
      return logger2.throwArgumentError("invalid BigNumber string", "value", value);
    }
    if (typeof value === "number") {
      if (value % 1) {
        throwFault("underflow", "BigNumber.from", value);
      }
      if (value >= MAX_SAFE || value <= -MAX_SAFE) {
        throwFault("overflow", "BigNumber.from", value);
      }
      return BigNumber.from(String(value));
    }
    const anyValue = value;
    if (typeof anyValue === "bigint") {
      return BigNumber.from(anyValue.toString());
    }
    if (isBytes5(anyValue)) {
      return BigNumber.from(hexlify(anyValue));
    }
    if (anyValue) {
      if (anyValue.toHexString) {
        const hex = anyValue.toHexString();
        if (typeof hex === "string") {
          return BigNumber.from(hex);
        }
      } else {
        let hex = anyValue._hex;
        if (hex == null && anyValue.type === "BigNumber") {
          hex = anyValue.hex;
        }
        if (typeof hex === "string") {
          if (isHexString(hex) || hex[0] === "-" && isHexString(hex.substring(1))) {
            return BigNumber.from(hex);
          }
        }
      }
    }
    return logger2.throwArgumentError("invalid BigNumber value", "value", value);
  }
  static isBigNumber(value) {
    return !!(value && value._isBigNumber);
  }
}
function toHex5(value) {
  if (typeof value !== "string") {
    return toHex5(value.toString(16));
  }
  if (value[0] === "-") {
    value = value.substring(1);
    if (value[0] === "-") {
      logger2.throwArgumentError("invalid hex", "value", value);
    }
    value = toHex5(value);
    if (value === "0x00") {
      return value;
    }
    return "-" + value;
  }
  if (value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }
  if (value === "0x") {
    return "0x00";
  }
  if (value.length % 2) {
    value = "0x0" + value.substring(2);
  }
  while (value.length > 4 && value.substring(0, 4) === "0x00") {
    value = "0x" + value.substring(4);
  }
  return value;
}
function toBigNumber(value) {
  return BigNumber.from(toHex5(value));
}
function toBN(value) {
  const hex = BigNumber.from(value).toHexString();
  if (hex[0] === "-") {
    return new BN("-" + hex.substring(3), 16);
  }
  return new BN(hex.substring(2), 16);
}
function throwFault(fault, operation, value) {
  const params = { fault, operation };
  if (value != null) {
    params.value = value;
  }
  return logger2.throwError(fault, Logger.errors.NUMERIC_FAULT, params);
}
function _base36To16(value) {
  return new BN(value, 36).toString(16);
}
// node_modules/@ethersproject/address/node_modules/@ethersproject/keccak256/lib.esm/index.js
var import_js_sha3 = __toESM(require_sha3(), 1);
function keccak2565(data) {
  return "0x" + import_js_sha3.default.keccak_256(arrayify(data));
}

// node_modules/@ethersproject/address/lib.esm/_version.js
var version7 = "address/5.8.0";

// node_modules/@ethersproject/address/lib.esm/index.js
var logger3 = new Logger(version7);
function getChecksumAddress(address) {
  if (!isHexString(address, 20)) {
    logger3.throwArgumentError("invalid address", "address", address);
  }
  address = address.toLowerCase();
  const chars = address.substring(2).split("");
  const expanded = new Uint8Array(40);
  for (let i = 0;i < 40; i++) {
    expanded[i] = chars[i].charCodeAt(0);
  }
  const hashed = arrayify(keccak2565(expanded));
  for (let i = 0;i < 40; i += 2) {
    if (hashed[i >> 1] >> 4 >= 8) {
      chars[i] = chars[i].toUpperCase();
    }
    if ((hashed[i >> 1] & 15) >= 8) {
      chars[i + 1] = chars[i + 1].toUpperCase();
    }
  }
  return "0x" + chars.join("");
}
var MAX_SAFE_INTEGER = 9007199254740991;
function log10(x) {
  if (Math.log10) {
    return Math.log10(x);
  }
  return Math.log(x) / Math.LN10;
}
var ibanLookup = {};
for (let i = 0;i < 10; i++) {
  ibanLookup[String(i)] = String(i);
}
for (let i = 0;i < 26; i++) {
  ibanLookup[String.fromCharCode(65 + i)] = String(10 + i);
}
var safeDigits = Math.floor(log10(MAX_SAFE_INTEGER));
function ibanChecksum(address) {
  address = address.toUpperCase();
  address = address.substring(4) + address.substring(0, 2) + "00";
  let expanded = address.split("").map((c) => {
    return ibanLookup[c];
  }).join("");
  while (expanded.length >= safeDigits) {
    let block = expanded.substring(0, safeDigits);
    expanded = parseInt(block, 10) % 97 + expanded.substring(block.length);
  }
  let checksum3 = String(98 - parseInt(expanded, 10) % 97);
  while (checksum3.length < 2) {
    checksum3 = "0" + checksum3;
  }
  return checksum3;
}
function getAddress3(address) {
  let result = null;
  if (typeof address !== "string") {
    logger3.throwArgumentError("invalid address", "address", address);
  }
  if (address.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
    if (address.substring(0, 2) !== "0x") {
      address = "0x" + address;
    }
    result = getChecksumAddress(address);
    if (address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && result !== address) {
      logger3.throwArgumentError("bad address checksum", "address", address);
    }
  } else if (address.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
    if (address.substring(2, 4) !== ibanChecksum(address)) {
      logger3.throwArgumentError("bad icap checksum", "address", address);
    }
    result = _base36To16(address.substring(4));
    while (result.length < 40) {
      result = "0" + result;
    }
    result = getChecksumAddress("0x" + result);
  } else {
    logger3.throwArgumentError("invalid address", "address", address);
  }
  return result;
}

// node_modules/@uniswap/sdk-core/dist/esm/src/utils/validateAndParseAddress.js
function validateAndParseAddress(address) {
  try {
    return getAddress3(address);
  } catch (error) {
    throw new Error(`${address} is not a valid address.`);
  }
}
var startsWith0xLen42HexRegex = /^0x[0-9a-fA-F]{40}$/;
function checkValidAddress(address) {
  if (startsWith0xLen42HexRegex.test(address)) {
    return address;
  }
  throw new Error(`${address} is not a valid address.`);
}

// node_modules/@uniswap/sdk-core/dist/esm/src/entities/token.js
class Token extends BaseCurrency {
  constructor(chainId, address, decimals, symbol, name, bypassChecksum, buyFeeBps, sellFeeBps) {
    super(chainId, decimals, symbol, name);
    this.isNative = false;
    this.isToken = true;
    if (bypassChecksum) {
      this.address = checkValidAddress(address);
    } else {
      this.address = validateAndParseAddress(address);
    }
    if (buyFeeBps) {
      invariant(buyFeeBps.gte(BigNumber.from(0)), "NON-NEGATIVE FOT FEES");
    }
    if (sellFeeBps) {
      invariant(sellFeeBps.gte(BigNumber.from(0)), "NON-NEGATIVE FOT FEES");
    }
    this.buyFeeBps = buyFeeBps;
    this.sellFeeBps = sellFeeBps;
  }
  equals(other) {
    return other.isToken && this.chainId === other.chainId && this.address.toLowerCase() === other.address.toLowerCase();
  }
  sortsBefore(other) {
    invariant(this.chainId === other.chainId, "CHAIN_IDS");
    invariant(this.address.toLowerCase() !== other.address.toLowerCase(), "ADDRESSES");
    return this.address.toLowerCase() < other.address.toLowerCase();
  }
  get wrapped() {
    return this;
  }
}

// node_modules/@uniswap/v3-sdk/dist/esm/src/internalConstants.js
var NEGATIVE_ONE = jsbi_default.BigInt(-1);
var ZERO = jsbi_default.BigInt(0);
var ONE = jsbi_default.BigInt(1);
var Q96 = jsbi_default.exponentiate(jsbi_default.BigInt(2), jsbi_default.BigInt(96));
var Q192 = jsbi_default.exponentiate(Q96, jsbi_default.BigInt(2));

// node_modules/@uniswap/v3-sdk/dist/esm/src/utils/mostSignificantBit.js
var TWO = jsbi_default.BigInt(2);
var POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map((pow) => [
  pow,
  jsbi_default.exponentiate(TWO, jsbi_default.BigInt(pow))
]);
function mostSignificantBit(x) {
  invariant(jsbi_default.greaterThan(x, ZERO), "ZERO");
  invariant(jsbi_default.lessThanOrEqual(x, MaxUint256), "MAX");
  let msb = 0;
  for (const [power, min] of POWERS_OF_2) {
    if (jsbi_default.greaterThanOrEqual(x, min)) {
      x = jsbi_default.signedRightShift(x, jsbi_default.BigInt(power));
      msb += power;
    }
  }
  return msb;
}

// node_modules/@uniswap/v3-sdk/dist/esm/src/utils/tickMath.js
function mulShift(val, mulBy) {
  return jsbi_default.signedRightShift(jsbi_default.multiply(val, jsbi_default.BigInt(mulBy)), jsbi_default.BigInt(128));
}
var Q32 = jsbi_default.exponentiate(jsbi_default.BigInt(2), jsbi_default.BigInt(32));

class TickMath {
  constructor() {}
  static getSqrtRatioAtTick(tick) {
    invariant(tick >= TickMath.MIN_TICK && tick <= TickMath.MAX_TICK && Number.isInteger(tick), "TICK");
    const absTick = tick < 0 ? tick * -1 : tick;
    let ratio = (absTick & 1) !== 0 ? jsbi_default.BigInt("0xfffcb933bd6fad37aa2d162d1a594001") : jsbi_default.BigInt("0x100000000000000000000000000000000");
    if ((absTick & 2) !== 0)
      ratio = mulShift(ratio, "0xfff97272373d413259a46990580e213a");
    if ((absTick & 4) !== 0)
      ratio = mulShift(ratio, "0xfff2e50f5f656932ef12357cf3c7fdcc");
    if ((absTick & 8) !== 0)
      ratio = mulShift(ratio, "0xffe5caca7e10e4e61c3624eaa0941cd0");
    if ((absTick & 16) !== 0)
      ratio = mulShift(ratio, "0xffcb9843d60f6159c9db58835c926644");
    if ((absTick & 32) !== 0)
      ratio = mulShift(ratio, "0xff973b41fa98c081472e6896dfb254c0");
    if ((absTick & 64) !== 0)
      ratio = mulShift(ratio, "0xff2ea16466c96a3843ec78b326b52861");
    if ((absTick & 128) !== 0)
      ratio = mulShift(ratio, "0xfe5dee046a99a2a811c461f1969c3053");
    if ((absTick & 256) !== 0)
      ratio = mulShift(ratio, "0xfcbe86c7900a88aedcffc83b479aa3a4");
    if ((absTick & 512) !== 0)
      ratio = mulShift(ratio, "0xf987a7253ac413176f2b074cf7815e54");
    if ((absTick & 1024) !== 0)
      ratio = mulShift(ratio, "0xf3392b0822b70005940c7a398e4b70f3");
    if ((absTick & 2048) !== 0)
      ratio = mulShift(ratio, "0xe7159475a2c29b7443b29c7fa6e889d9");
    if ((absTick & 4096) !== 0)
      ratio = mulShift(ratio, "0xd097f3bdfd2022b8845ad8f792aa5825");
    if ((absTick & 8192) !== 0)
      ratio = mulShift(ratio, "0xa9f746462d870fdf8a65dc1f90e061e5");
    if ((absTick & 16384) !== 0)
      ratio = mulShift(ratio, "0x70d869a156d2a1b890bb3df62baf32f7");
    if ((absTick & 32768) !== 0)
      ratio = mulShift(ratio, "0x31be135f97d08fd981231505542fcfa6");
    if ((absTick & 65536) !== 0)
      ratio = mulShift(ratio, "0x9aa508b5b7a84e1c677de54f3e99bc9");
    if ((absTick & 131072) !== 0)
      ratio = mulShift(ratio, "0x5d6af8dedb81196699c329225ee604");
    if ((absTick & 262144) !== 0)
      ratio = mulShift(ratio, "0x2216e584f5fa1ea926041bedfe98");
    if ((absTick & 524288) !== 0)
      ratio = mulShift(ratio, "0x48a170391f7dc42444e8fa2");
    if (tick > 0)
      ratio = jsbi_default.divide(MaxUint256, ratio);
    return jsbi_default.greaterThan(jsbi_default.remainder(ratio, Q32), ZERO) ? jsbi_default.add(jsbi_default.divide(ratio, Q32), ONE) : jsbi_default.divide(ratio, Q32);
  }
  static getTickAtSqrtRatio(sqrtRatioX96) {
    invariant(jsbi_default.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) && jsbi_default.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO), "SQRT_RATIO");
    const sqrtRatioX128 = jsbi_default.leftShift(sqrtRatioX96, jsbi_default.BigInt(32));
    const msb = mostSignificantBit(sqrtRatioX128);
    let r;
    if (jsbi_default.greaterThanOrEqual(jsbi_default.BigInt(msb), jsbi_default.BigInt(128))) {
      r = jsbi_default.signedRightShift(sqrtRatioX128, jsbi_default.BigInt(msb - 127));
    } else {
      r = jsbi_default.leftShift(sqrtRatioX128, jsbi_default.BigInt(127 - msb));
    }
    let log_2 = jsbi_default.leftShift(jsbi_default.subtract(jsbi_default.BigInt(msb), jsbi_default.BigInt(128)), jsbi_default.BigInt(64));
    for (let i = 0;i < 14; i++) {
      r = jsbi_default.signedRightShift(jsbi_default.multiply(r, r), jsbi_default.BigInt(127));
      const f = jsbi_default.signedRightShift(r, jsbi_default.BigInt(128));
      log_2 = jsbi_default.bitwiseOr(log_2, jsbi_default.leftShift(f, jsbi_default.BigInt(63 - i)));
      r = jsbi_default.signedRightShift(r, f);
    }
    const log_sqrt10001 = jsbi_default.multiply(log_2, jsbi_default.BigInt("255738958999603826347141"));
    const tickLow = jsbi_default.toNumber(jsbi_default.signedRightShift(jsbi_default.subtract(log_sqrt10001, jsbi_default.BigInt("3402992956809132418596140100660247210")), jsbi_default.BigInt(128)));
    const tickHigh = jsbi_default.toNumber(jsbi_default.signedRightShift(jsbi_default.add(log_sqrt10001, jsbi_default.BigInt("291339464771989622907027621153398088495")), jsbi_default.BigInt(128)));
    return tickLow === tickHigh ? tickLow : jsbi_default.lessThanOrEqual(TickMath.getSqrtRatioAtTick(tickHigh), sqrtRatioX96) ? tickHigh : tickLow;
  }
}
TickMath.MIN_TICK = -887272;
TickMath.MAX_TICK = -TickMath.MIN_TICK;
TickMath.MIN_SQRT_RATIO = jsbi_default.BigInt("4295128739");
TickMath.MAX_SQRT_RATIO = jsbi_default.BigInt("1461446703485210103287273052203988822378723970342");

// src/services/tickMath.ts
function getTickRange(currentTick, tickSpacing, rangeMultiplier = 10) {
  const nearestTick = Math.floor(currentTick / tickSpacing) * tickSpacing;
  const tickLower = nearestTick - tickSpacing * rangeMultiplier;
  const tickUpper = nearestTick + tickSpacing * rangeMultiplier;
  return {
    tickLower: TickMath.MIN_TICK < tickLower ? tickLower : TickMath.MIN_TICK,
    tickUpper: TickMath.MAX_TICK > tickUpper ? tickUpper : TickMath.MAX_TICK
  };
}

// src/services/priceMath.ts
var Q962 = 2n ** 96n;
function priceToSqrtPriceX96(price, decimals0, decimals1) {
  const adjustedPrice = price * 10 ** (decimals1 - decimals0);
  const sqrt = Math.sqrt(adjustedPrice);
  return BigInt(Math.floor(sqrt * Number(Q962)));
}

// src/services/createPosition.ts
async function createPosition(params) {
  const pool = await getPoolAddress(params.token0, params.token1, params.fee);
  if (pool === "0x0000000000000000000000000000000000000000") {
    return {
      status: "CREATE_POOL_REQUIRED",
      createPoolTx: buildCreatePoolCalldata(params.token0, params.token1, params.fee)
    };
  }
  const state = await getPoolState2(pool);
  if (state.sqrtPriceX96 === 0n) {
    const sqrtPriceX96 = priceToSqrtPriceX96(Number(params.initialPrice), params.token0Decimals, params.token1Decimals);
    return {
      status: "INITIALIZE_REQUIRED",
      pool,
      initializeTx: buildInitializePoolCalldata(pool, sqrtPriceX96)
    };
  }
  const range = getTickRange(state.tick, Number(state.tickSpacing));
  const token0 = new Token(14, params.token0, params.token0Decimals, params.token0Symbol);
  const token1 = new Token(14, params.token1, params.token1Decimals, params.token1Symbol);
  const position = buildPosition({
    token0,
    token1,
    fee: params.fee,
    sqrtPriceX96: state.sqrtPriceX96,
    tickCurrent: state.tick,
    tickLower: range.tickLower,
    tickUpper: range.tickUpper,
    amount0: params.amount0,
    amount1: params.amount1
  });
  const mint = buildMintPositionCalldata({
    token0: params.token0,
    token1: params.token1,
    fee: params.fee,
    tickLower: range.tickLower,
    tickUpper: range.tickUpper,
    amount0Desired: BigInt(position.amount0),
    amount1Desired: BigInt(position.amount1),
    amount0Min: 0n,
    amount1Min: 0n,
    recipient: params.recipient,
    deadline: params.deadline
  });
  return {
    pool,
    ...range,
    ...position,
    mint
  };
}

// src/routes/createPosition.ts
var createPositionRoutes = new Hono2;
createPositionRoutes.post("/", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  try {
    const result = await createPosition({
      ...body,
      fee: Number(body.fee),
      initialPrice: Number(body.initialPrice),
      amount0: BigInt(body.amount0),
      amount1: BigInt(body.amount1),
      deadline: BigInt(body.deadline)
    });
    return c.json(result);
  } catch (error) {
    return c.json({
      error: "POSITION_BUILD_FAILED",
      message: error instanceof Error ? error.message : "unknown error"
    }, 400);
  }
});

// src/data/tokens.ts
var FLARE_TOKENS = [
  {
    symbol: "WFLR",
    name: "Wrapped Flare",
    address: "0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d",
    decimals: 18
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6",
    decimals: 6
  }
];

// src/services/tokenSearch.ts
function searchTokens(query) {
  const q = query.toLowerCase();
  return FLARE_TOKENS.filter((token) => [
    token.symbol,
    token.name,
    token.address
  ].join(" ").toLowerCase().includes(q));
}

// src/routes/tokens.ts
var tokenRoutes = new Hono2;
function result(query) {
  return searchTokens(query);
}
tokenRoutes.post("/SearchTokens", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  return c.json({
    tokens: result(body.query ?? body.searchTerm ?? "")
  });
});
tokenRoutes.post("/data.v1.SearchService/SearchTokens", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  return c.json({
    tokens: result(body.query ?? body.searchTerm ?? "")
  });
});
tokenRoutes.post("/search", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  return c.json({
    tokens: result(body.query ?? "")
  });
});
tokenRoutes.post("/GetTokens", async (c) => {
  return c.json({
    tokens: FLARE_TOKENS
  });
});
tokenRoutes.get("/", (c) => {
  return c.json({
    tokens: FLARE_TOKENS
  });
});

// src/routes/uniswapLiquidity.ts
var uniswapLiquidityRoutes = new Hono2;
async function handleCreatePosition(c) {
  try {
    let body = {};
    try {
      body = await c.req.json();
    } catch {
      console.log("EMPTY JSON BODY", c.req.path);
    }
    const result2 = await createPosition({
      ...body,
      fee: Number(body.fee ?? 0),
      initialPrice: Number(body.initialPrice ?? 0),
      amount0: BigInt(body.amount0 ?? 0),
      amount1: BigInt(body.amount1 ?? 0),
      deadline: BigInt(body.deadline ?? Math.floor(Date.now() / 1000) + 3600)
    });
    return c.json(result2);
  } catch (error) {
    return c.json({
      error: "CREATE_POSITION_FAILED",
      message: error instanceof Error ? error.message : "unknown"
    }, 400);
  }
}
uniswapLiquidityRoutes.post("/uniswap.liquidity.v2.LiquidityService/CreatePosition", handleCreatePosition);
uniswapLiquidityRoutes.post("/CreatePosition", handleCreatePosition);

// src/routes/dataApi.ts
var dataApiRoutes = new Hono2;
dataApiRoutes.post("/GetTokenPrices", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("GetTokenPrices", body);
  const tokens = body.tokenAddresses ?? [];
  const prices = tokens.map((address) => ({
    address,
    price: "0",
    currency: "USD"
  }));
  return c.json({
    prices
  });
});
dataApiRoutes.post("/GetTokenMetadata", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const addresses = body.tokenAddresses ?? [];
  return c.json({
    tokens: FLARE_TOKENS.filter((t) => addresses.includes(t.address))
  });
});
dataApiRoutes.post("/SearchTokens", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const q = String(body.query ?? "").toLowerCase();
  return c.json({
    tokens: FLARE_TOKENS.filter((t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q))
  });
});
dataApiRoutes.post("/ConvertFiat", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("ConvertFiat", body);
  return c.json({
    convertedAmount: body.amount ?? 0,
    currency: body.currency ?? "USD"
  });
});
dataApiRoutes.post("/GetWalletBalances", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("GetWalletBalances", body);
  const address = body.walletAddress ?? body.address;
  if (!address) {
    return c.json({
      balances: []
    });
  }
  const balances = [];
  for (const token of FLARE_TOKENS) {
    try {
      const balance = await flareClient.readContract({
        address: token.address,
        abi: [
          {
            type: "function",
            name: "balanceOf",
            stateMutability: "view",
            inputs: [
              {
                name: "account",
                type: "address"
              }
            ],
            outputs: [
              {
                type: "uint256"
              }
            ]
          }
        ],
        functionName: "balanceOf",
        args: [address]
      });
      balances.push({
        token,
        balance: balance.toString()
      });
    } catch {
      continue;
    }
  }
  return c.json({
    balances
  });
});
dataApiRoutes.post("/ListPools", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("ListPools", body);
  return c.json({
    pools: []
  });
});
dataApiRoutes.post("/GetPortfolio", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("GetPortfolio", body);
  return c.json({
    positions: [],
    balances: []
  });
});
dataApiRoutes.post("/ListTransactions", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("ListTransactions", body);
  return c.json({
    transactions: []
  });
});

// src/routes/graphql.ts
var graphqlRoutes = new Hono2;
graphqlRoutes.post("/", async (c) => {
  try {
    const rawBody = await c.req.text();
    if (!rawBody) {
      console.log("GRAPHQL EMPTY BODY");
      return c.json({
        data: {}
      });
    }
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      console.log("GRAPHQL INVALID JSON", {
        rawBody,
        error: error instanceof Error ? error.message : error
      });
      return c.json({
        data: {}
      });
    }
    const operationName = body.operationName ?? "";
    console.log("GRAPHQL OPERATION", operationName);
    console.log("GRAPHQL VARIABLES", JSON.stringify(body.variables ?? {}, null, 2));
    console.log("GRAPHQL QUERY", body.query ?? "");
    switch (operationName) {
      case "SearchTokens": {
        const query = body.variables?.search ?? body.variables?.query ?? "";
        return c.json({
          data: {
            tokens: searchTokens(query)
          }
        });
      }
      case "Token": {
        const address = body.variables?.address ?? "";
        return c.json({
          data: {
            tokens: searchTokens(address)
          }
        });
      }
      case "V3Pool": {
        const address = body.variables?.address ?? "";
        const chain = body.variables?.chain ?? "";
        if (!address) {
          return c.json({
            data: {
              v3Pool: null
            }
          });
        }
        return c.json({
          data: {
            v3Pool: {
              id: address,
              address,
              protocolVersion: "V3",
              feeTier: 3000,
              token0Supply: 0,
              token1Supply: 0,
              txCount: 0,
              token0: null,
              token1: null,
              totalLiquidity: {
                value: 0
              },
              volume24h: {
                value: 0
              }
            }
          }
        });
      }
      case "PoolPriceHistory": {
        const pool = body.variables?.pool;
        if (!pool) {
          return c.json({
            data: {
              poolPriceHistory: []
            }
          });
        }
        const state = await getPoolState(pool);
        return c.json({
          data: {
            poolPriceHistory: [
              {
                sqrtPriceX96: state.slot0[0].toString(),
                tick: state.slot0[1]
              }
            ]
          }
        });
      }
      case "AllV4Ticks": {
        const pool = body.variables?.pool;
        if (!pool) {
          return c.json({
            data: {
              ticks: []
            }
          });
        }
        const ticks = await getTicks(pool);
        return c.json({
          data: {
            ticks
          }
        });
      }
      default: {
        console.log("GRAPHQL UNKNOWN OPERATION", operationName);
        return c.json({
          data: {
            token: null,
            tokens: [],
            pool: null,
            pools: [],
            v3Pool: null,
            positions: [],
            portfolio: {
              positions: [],
              balances: []
            },
            account: null
          }
        });
      }
    }
  } catch (error) {
    return c.json({
      error: error instanceof Error ? error.message : "unknown error"
    }, 500);
  }
});

// src/services/quote.ts
async function quoteExactInputSingle(params) {
  return flareClient.simulateContract({
    address: FLARE_CONTRACTS2.quoterV2Address,
    abi: quoterV2Abi,
    functionName: "quoteExactInputSingle",
    args: [
      {
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        amountIn: params.amountIn,
        fee: params.fee,
        sqrtPriceLimitX96: 0n
      }
    ]
  });
}

// src/routes/trading.ts
var tradingRoutes = new Hono2;
tradingRoutes.post("/check_delegation", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("CHECK DELEGATION", body);
  const result2 = {};
  for (const address of body.walletAddresses ?? []) {
    result2[address] = {};
    for (const chainId of body.chainIds ?? []) {
      result2[address][chainId] = {
        currentDelegationAddress: null,
        latestDelegationAddress: null,
        isWalletDelegatedToUniswap: false
      };
    }
  }
  return c.json({
    delegationDetails: result2
  });
});
tradingRoutes.post("/quote", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const pool = await getPoolAddress(body.tokenIn, body.tokenOut, body.fee);
  if (pool === "0x0000000000000000000000000000000000000000") {
    return c.json({
      error: "POOL_NOT_FOUND",
      message: "No V3 pool exists for this token pair and fee",
      tokenIn: body.tokenIn,
      tokenOut: body.tokenOut,
      fee: body.fee
    }, 400);
  }
  const result2 = await quoteExactInputSingle({
    tokenIn: body.tokenIn,
    tokenOut: body.tokenOut,
    amountIn: BigInt(body.amountIn),
    fee: body.fee
  });
  return c.json({
    quote: result2.result
  });
});

// src/routes/liquidityCompat.ts
var liquidityCompatRoutes = new Hono2;
liquidityCompatRoutes.post("/PoolInfo", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("POOL INFO", body);
  return c.json({
    pool: null,
    exists: false,
    token0: body.token0 ?? null,
    token1: body.token1 ?? null,
    fee: body.fee ?? null
  });
});
liquidityCompatRoutes.post("/GetPool", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("GET POOL", body);
  return c.json({
    pool: null
  });
});
liquidityCompatRoutes.post("/GetPosition", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("GET POSITION", body);
  return c.json({
    position: null
  });
});

// src/routes/uniswapLiquidityCompat.ts
var uniswapLiquidityCompatRoutes = new Hono2;
uniswapLiquidityCompatRoutes.post("/CreatePosition", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("CREATE POSITION REQUEST", JSON.stringify(body, null, 2));
  try {
    const result2 = await createPosition({
      ...body,
      fee: Number(body.fee ?? 0),
      initialPrice: Number(body.initialPrice ?? 0),
      amount0: BigInt(body.amount0 ?? 0),
      amount1: BigInt(body.amount1 ?? 0),
      deadline: BigInt(body.deadline ?? Math.floor(Date.now() / 1000) + 3600)
    });
    return c.json(result2);
  } catch (error) {
    return c.json({
      error: "CREATE_POSITION_FAILED",
      message: error instanceof Error ? error.message : "unknown"
    }, 400);
  }
});

// src/routes/poolCompat.ts
var poolCompatRoutes = new Hono2;
poolCompatRoutes.post("/GetPoolAddress", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const pool = await getPoolAddress2(body.tokenA, body.tokenB, Number(body.fee));
  return c.json({
    pool
  });
});
poolCompatRoutes.post("/GetPoolState", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const state = await getPoolState(body.pool ?? body.address);
  return c.json({
    state
  });
});

// src/routes/tickCompat.ts
var tickCompatRoutes = new Hono2;
tickCompatRoutes.post("/GetTicks", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const ticks = await getTicks(body.pool ?? body.address, Number(body.word ?? 0));
  return c.json({
    ticks
  });
});

// src/routes/positionCompat.ts
var positionCompatRoutes = new Hono2;
positionCompatRoutes.post("/BuildMint", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const data = buildMintCalldata({
    token0: body.token0,
    token1: body.token1,
    fee: Number(body.fee),
    tickLower: Number(body.tickLower),
    tickUpper: Number(body.tickUpper),
    amount0Desired: BigInt(body.amount0Desired),
    amount1Desired: BigInt(body.amount1Desired),
    recipient: body.recipient,
    deadline: BigInt(body.deadline)
  });
  return c.json({
    to: FLARE_CONTRACTS2.positionManagerAddress,
    data,
    value: "0"
  });
});

// src/routes/approveCompat.ts
var approveCompatRoutes = new Hono2;
approveCompatRoutes.post("/Approve", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const data = buildApproveCalldata({
    spender: FLARE_CONTRACTS2.positionManagerAddress,
    amount: BigInt(body.amount ?? 0)
  });
  return c.json({
    to: body.token,
    data,
    value: "0"
  });
});

// src/routes/poolActionCompat.ts
var poolActionCompatRoutes = new Hono2;
poolActionCompatRoutes.post("/CreatePool", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  return c.json(buildCreatePoolCalldata(body.tokenA, body.tokenB, Number(body.fee)));
});
poolActionCompatRoutes.post("/InitializePool", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  return c.json({
    ...buildInitializePoolCalldata(body.pool, BigInt(body.sqrtPriceX96)),
    sqrtPriceX96: body.sqrtPriceX96
  });
});

// src/routes/multicallCompat.ts
var multicallCompatRoutes = new Hono2;
multicallCompatRoutes.post("/Multicall", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  const data = buildMulticallCalldata(body.calls ?? []);
  return c.json({
    to: getMulticallAddress2(),
    data,
    value: "0"
  });
});

// src/routes/poolCreateCompat.ts
var poolCreateCompatRoutes = new Hono2;
poolCreateCompatRoutes.post("/CreatePool", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  return c.json(buildCreatePoolCalldata(body.tokenA, body.tokenB, Number(body.fee)));
});
poolCreateCompatRoutes.post("/InitializePool", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  return c.json({
    ...buildInitializePoolCalldata(body.pool, BigInt(body.sqrtPriceX96)),
    sqrtPriceX96: body.sqrtPriceX96
  });
});

// src/routes/createPositionCompat.ts
var createPositionCompatRoutes = new Hono2;
createPositionCompatRoutes.post("/CreatePosition", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  try {
    const result2 = await createPosition({
      ...body,
      fee: Number(body.fee ?? 0),
      initialPrice: Number(body.initialPrice ?? 0),
      amount0: BigInt(body.amount0 ?? 0),
      amount1: BigInt(body.amount1 ?? 0),
      deadline: BigInt(body.deadline ?? Math.floor(Date.now() / 1000) + 3600)
    });
    return c.json(result2);
  } catch (error) {
    return c.json({
      error: "POSITION_BUILD_FAILED",
      message: error instanceof Error ? error.message : "unknown"
    }, 400);
  }
});

// src/routes/statsig.ts
var statsigRoutes = new Hono2;
statsigRoutes.all("/*", async (c) => {
  const path = c.req.path.replace(/^\/v1\/statsig-proxy/, "/v1");
  console.log("Statsig request:", {
    method: c.req.method,
    path
  });
  if (path.includes("/initialize")) {
    return c.json({
      dynamic_configs: {},
      feature_gates: {},
      layer_configs: {},
      time: Date.now()
    });
  }
  if (path.includes("/rgstr")) {
    return c.json({
      success: true
    });
  }
  return c.json({
    success: true
  });
});

// src/routes/session.ts
var sessionRoutes = new Hono2;
sessionRoutes.post("/InitSession", async (c) => {
  return c.json({
    sessionId: null
  });
});

// src/routes/amplitude.ts
var amplitudeRoutes = new Hono2;
amplitudeRoutes.post("*", async (c) => {
  const body = await c.req.text();
  console.log("AMPLITUDE EVENT BODY", body.slice(0, 1000));
  console.log("AMPLITUDE HEADERS", Object.fromEntries(c.req.raw.headers));
  return new Response(JSON.stringify({
    code: 200,
    server_upload_time: Date.now(),
    events_ingested: true
  }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-credentials": "true"
    }
  });
});

// src/routes/rpc.ts
var rpcRoutes = new Hono2;
rpcRoutes.post("/:chainId", async (c) => {
  try {
    const body = await c.req.text();
    const controller = new AbortController;
    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);
    console.log("RPC REQUEST", c.req.path, body);
    try {
      const parsed = JSON.parse(body);
      console.log("RPC METHOD", parsed.method);
    } catch {}
    const response = await fetch("https://flare-api.flare.network/ext/C/rpc", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body,
      signal: controller.signal
    });
    clearTimeout(timeout);
    const json = await response.json();
    console.log("RPC RESPONSE STATUS", response.status);
    console.log("RPC RESPONSE JSON", json);
    if (json === null) {
      return c.json({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32000,
          message: "upstream returned null"
        }
      }, 502);
    }
    return c.json(json, response.status);
  } catch (error) {
    console.error("RPC ERROR", error);
    return c.json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: error instanceof Error ? error.message : "RPC proxy error"
      },
      id: null
    }, 500);
  }
});

// src/routes/unitag.ts
var unitagRoutes = new Hono2;
unitagRoutes.post("/GetAddress", async (c) => {
  return c.json({
    address: null
  });
});

// src/routes/notification.ts
var notificationRoutes = new Hono2;
notificationRoutes.post("/GetNotifications", async (c) => {
  return c.json({
    notifications: []
  });
});

// src/routes/compliance.ts
var complianceRoutes = new Hono2;
complianceRoutes.post("/ScreenAddress", async (c) => {
  let body = {};
  try {
    body = await c.req.json();
  } catch {
    console.log("EMPTY JSON BODY", c.req.path);
  }
  console.log("ScreenAddress", body);
  return c.json({
    result: {
      isSanctioned: false,
      riskLevel: "LOW"
    }
  });
});

// src/index.ts
var app = new Hono2;
app.use("*", cors({
  origin: [
    "http://localhost:3000",
    "https://iranvault.online"
  ],
  credentials: true
}));
app.use("*", cors({
  origin: [
    "http://localhost:3000",
    "https://iranvault.online"
  ],
  allowMethods: [
    "GET",
    "POST",
    "OPTIONS"
  ],
  allowHeaders: [
    "Content-Type",
    "Authorization",
    "_dd-custom-header-graph-ql-operation-name",
    "_dd-custom-header-graph-ql-operation-type",
    "x-request-source",
    "x-requested-with",
    "connect-protocol-version",
    "x-app-version",
    "x-uniswap-locale"
  ],
  credentials: true
}));
app.get("/", (c) => {
  return c.json({
    service: "flare-liquidity-service",
    status: "ok"
  });
});
app.route("/liquidity", liquidityRoutes);
app.route("/pool/create", createPoolRoutes);
app.route("/pool/initialize", initializePoolRoutes);
app.route("/position/mint", mintPositionRoutes);
app.route("/pool/state", poolStateRoutes);
app.route("/pool/ticks", tickRoutes);
app.route("/position/approve", approveRoutes);
app.route("/position/multicall", multicallRoutes);
app.route("/pool/address", poolAddressRoutes);
app.route("/position/build", positionBuildRoutes);
app.route("/position/create", createPositionRoutes);
app.route("/tokens", tokenRoutes);
app.route("/uniswap.liquidity.v1.LiquidityService", liquidityRoutes);
app.route("/", uniswapLiquidityRoutes);
app.route("/data.v1.DataApiService", dataApiRoutes);
app.route("/data.v2.DataApiService", dataApiRoutes);
app.route("/v2/data.v1.DataApiService", dataApiRoutes);
app.route("/v2/data.v2.DataApiService", dataApiRoutes);
app.route("/v2/data.v1.DataApiService", dataApiRoutes);
app.route("/v1/graphql", graphqlRoutes);
app.route("/v1/statsig-proxy", statsigRoutes);
app.route("/uniswap.platformservice.v1.SessionService", sessionRoutes);
app.route("/amplitude", amplitudeRoutes);
app.route("/rpc", rpcRoutes);
app.route("/uniswap.unitag.v1.UnitagService", unitagRoutes);
app.route("/uniswap.notificationservice.v1.NotificationService", notificationRoutes);
app.route("/uniswap.compliancev2service.v1.compliancev2Service", complianceRoutes);
app.route("/wallet", tradingRoutes);
app.route("/uniswap.liquidity.v1.LiquidityService", liquidityCompatRoutes);
app.route("/uniswap.liquidity.v2.LiquidityService", uniswapLiquidityCompatRoutes);
app.route("/pool", poolCompatRoutes);
app.route("/ticks", tickCompatRoutes);
app.route("/position", positionCompatRoutes);
app.route("/approve", approveCompatRoutes);
app.route("/pool-action", poolActionCompatRoutes);
app.route("/multicall", multicallCompatRoutes);
app.route("/pool-create", poolCreateCompatRoutes);
app.route("/create-position", createPositionCompatRoutes);
var server = createServer((req, res) => {
  Promise.resolve(app.fetch(new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method,
    headers: req.headers
  }))).then(async (response) => {
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(await response.text());
  });
});
var wss = new WebSocketServer({
  server
});
wss.on("connection", (socket) => {
  console.log("WEBSOCKET CONNECTED");
  socket.send(JSON.stringify({
    type: "connected"
  }));
  socket.on("message", (message) => {
    console.log("WS MESSAGE", message.toString());
  });
  socket.on("close", () => {
    console.log("WEBSOCKET CLOSED");
  });
});
server.listen(config.port, () => {
  console.log(`Listening on ${config.port}`);
});
