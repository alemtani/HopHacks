const axios = require('axios');
const { JSDOM } = require('jsdom');
const whois = require('whois');

const reIp1 = new RegExp("^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
const reIp2 = new RegExp("^(0[xX][0-9a-fA-F]+)\.(0[xX][0-9a-fA-F]+)\.(0[xX][0-9a-fA-F]+)\.(0[xX][0-9a-fA-F]+)$");
const reTime = /(\d{4})-(\d{2})-(\d{2})/g;

const get_domain = function(url) {
  try {
    let domain = new URL(url);
    domain = domain.hostname;
    if (domain.includes('www.')) {
      domain = domain.substring(4);
    }
    return domain;
  } catch {
    return null;
  }
}

exports.get_domain = get_domain;

// 1.1
exports.validate_ip = function(domain) {
	try {
		if (reIp1.test(domain) || reIp2.test(domain)) {  
			return 1;
		}
		return -1;
	} catch {
		return 0;
	}
}

// 1.2
exports.get_length = function(url) {
	try {
		const length = url.length;
		if (length < 54) {
			return -1;
		} else if (length <= 75) {
			return 0;
		} else {
			return 1;
		}
	} catch {
		return 0;
	}
}

// 1.3
exports.validate_tinyurl = function(domain) {
	try {
		if (domain === "tinyurl.com" || domain === "bit.ly") {
			return 1;
		}
		return -1;
	} catch {
		return 0;
	}
}

// 1.4
exports.contains_at = function(url) {
	try {
		if (url.includes("@")) {
			return 1;
		}
		return -1;
	} catch {
		return 0;
	}
}

// 1.5
exports.locate_redirect = function(url) {
	try {
		if (url.lastIndexOf("//") > 6) {
			return 1;
		}
		return -1;
	} catch {
		return 0;
	}
}

// 1.6
exports.contains_dash = function(domain) {
	try {
		if (domain.includes("-")) {
			return 1;
		}
		return -1;
	} catch {
		return 0;
	}	
}

// 1.7
exports.count_dots = function(domain) {
	try {
		const count = (domain.match(/\./g) || []).length;
		if (count === 1) {
			return -1;
		} else if (count === 2) {
			return 0;
		}
		return 1;
	} catch {
		return 0;
	}
}

// 1.8, 1.9, 2.6, 4.1, 4.2 (must pass 1.12)
exports.verify_whois = function(domain, func) {
	whois.lookup(domain, function(err, data) {
		if (err || data.length === 0 || data.includes("No match for domain")) {
			func([0, 1, 1]);
		} else {
			dates = [];
			do {
				m = reTime.exec(data);
				if (m) {
					dates.push([m[1], m[2], m[3]].join('-'));
				}
			} while (m);
			const creation = Date.parse(dates[dates.length - 3]);
			const expiration = Date.parse(dates[dates.length - 2]);
			const today = new Date();

			const past = Math.abs(today - creation);
			const future = Math.abs(expiration - today);

			const codes = [-1];

			if (future / 1000 / 86400 / 365.25 >= 1) {
				codes.push(-1);
			} else {
				codes.push(1);
			}

			if (past / 1000 / 86400 / 365.25 >= 0.5) {
				codes.push(-1);
			} else {
				codes.push(1);
			}

			func(codes);
		}
	});
}

// 1.9, 4.1 (must pass 1.8, 2.6, 4.2)
exports.verify_dates = function(domain, func) {
	whois.lookup(domain, function(err, data) {
		if (err || data.length === 0 || data.includes("No match for domain")) {
			func([0, 0]);
		} else {
			dates = [];
			do {
				m = reTime.exec(data);
				if (m) {
					dates.push([m[1], m[2], m[3]].join('-'));
				}
			} while (m);
			const creation = Date.parse(dates[dates.length - 3]);
			const expiration = Date.parse(dates[dates.length - 2]);
			const today = new Date();

			const past = Math.abs(today - creation);
			const future = Math.abs(expiration - today);

			const codes = [];

			if (future / 1000 / 86400 / 365.25 >= 1) {
				codes.push(-1);
			} else {
				codes.push(1);
			}

			if (past / 1000 / 86400 / 365.25 >= 0.5) {
				codes.push(-1);
			} else {
				codes.push(1);
			}

			func(codes);
		}
	});
}

// 1.12
exports.validate_https = function(url) {
	try {
		if (url.includes("https") || url.includes("shttp")) {
			return -1;
		}
		return 1;
	} catch {
		return 0;
	}
}

// 2.2
exports.get_anchors = async function(url, domain) {
	try {
		const { data } = await axios.get(url);
		const dom = new JSDOM(data, {
      runScripts: "outside-only",
      resources: "usable"
    });
    const { document } = dom.window;

    let count = 0;
    let total = 0;
    document.querySelectorAll('a').forEach(link => {
    	if (get_domain(link.href) === domain) {
    		count++;
    	}
    	total++;
    });
    
    if (total === 0) {
			return 0;
		}

		if (count / total < 0.31) {
			return -1;
		} else if (count / total > 0.67) {
			return 1;
		} else {
			return 0;
		}
	} catch {
		return 0;
	}
}

// 3.5
exports.get_iframe = async function(url) {
	try {
		const { data } = await axios.get(url);
		const dom = new JSDOM(data, {
	      runScripts: "outside-only",
	      resources: "usable"
	    });
	    const { document } = dom.window;

	    if (document.querySelectorAll('iframe').length === 0) {
	    	return -1;
	    }
	    return 1;
	} catch {
		0;
	}
}