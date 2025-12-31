const toggle = document.getElementById("menu-toggle");
toggle.onclick = () => {
	document.body.classList.toggle("menu-open");
};

let loadMD; // exposed for handleHash
let contactFormHTML = "";

async function bootstrap() {
	// all the constant stuff
	const htmlCache = new Map();
	const nav = document.getElementById("nav");
	const projects = document.getElementById("projects");
	const content = document.getElementById("content");
	const pages = await fetch("/content/index.json").then(r => r.json());
	contactFormHTML = await fetch("/content/contact.html")
  .then(r => r.text());

	// build the navigation sidebar
	pages.forEach(p => {
		const a = document.createElement("a");
		a.textContent = p.title;
		a.href = `#${p.file}`;
		a.onclick = () => {
			document.body.classList.remove("menu-open");
		};
		if (p.section == "nav") {
			nav.appendChild(a);
		}
		else if (p.section == "projects") {
			projects.appendChild(a)
		}
	});

	// parse md
	async function parseMD(file) {
		let md = await fetch(`/content/${file}`).then(r => r.text());

		// convert ::sitelen:: blocks to <span class="sitelen">…</span>
		md = md.replace(/::sitelen::([\s\S]+?)::/g, (match, p1) => {
			return `<span class="sitelen">${p1.trim()}</span>`;
		});

		const html = marked.parse(md);
		htmlCache.set(file, html);
		return html;
	}

	// load md
	loadMD = async function (file) {
		if (file === "contact") {
			content.innerHTML = contactFormHTML;
			return;
		}
		
		if (htmlCache.has(file)) {
			content.innerHTML = htmlCache.get(file);
			MathJax.typesetPromise([content]);
			return;
		}
		
		const html = await parseMD(file);
		content.innerHTML = html;
		MathJax.typesetPromise([content]);
	};

	// load initial page
	let initialFile;
	if (location.hash.slice(1)) {
		initialFile = location.hash.slice(1);
	}
	else {
		initialFile = pages[0].file;
		window.location.replace(`#${initialFile}`)
	}
	await loadMD(initialFile);

	// preload everything else in background
	await Promise.all(
		pages
			.map(p => p.file)
			.filter(f => f !== initialFile)
			.map(f => parseMD(f))
	);
}

function handleHash() {
	const file = location.hash.slice(1);
	if (file && loadMD) loadMD(file);
}

window.addEventListener("hashchange", handleHash);

bootstrap();
