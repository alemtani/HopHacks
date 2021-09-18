const re1 = new RegExp("^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
const re2 = new RegExp("^(0[xX][0-9a-fA-F]+)\.(0[xX][0-9a-fA-F]+)\.(0[xX][0-9a-fA-F]+)\.(0[xX][0-9a-fA-F]+)$");

exports.get_domain = function(url) {
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

exports.validate_ip = function(domain) {
	if (re1.test(domain) || re2.test(domain)) {  
		return 1;
	}
	return -1;
}

exports.get_length = function(url) {
	const length = url.length();
	if (length < 54) {
		return -1;
	} else if (length <= 75) {
		return 0;
	} else {
		return 1;
	}
}

exports.validate_tinyurl = function(domain) {
	if (domain === "tinyurl.com" || domain === "bit.ly") {
		return 1;
	}
	return -1;
}

exports.contains_at = function(url) {
	if (url.includes("@")) {
		return 1;
	}
	return -1;
}

exports.locate_redirect = function(url) {
	if (url.lastIndexOf("//") > 6) {
		return 1;
	}
	return -1;
}

exports.contains_dash = function(domain) {
	if (domain.includes("-")) {
		return 1;
	}
	return -1;
}

exports.count_dots = function(domain) {
	return (domain.match(/\./g) || []).length;
}

exports.validate_https = function(url) {
	if (url.includes("https") || url.includes("shttp")) {
		return 1;
	}
	return -1;
}