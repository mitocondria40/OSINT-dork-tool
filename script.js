/* ========================
   DORKSEARCH PRO v4.0 - LOGIC
   ======================== */

const dorksData = [
  {
    type: "sec",
    category: "Attack Surface Mapping",
    icon: "fa-map-marked-alt",
    color: "#00ff41",
    items: [
      { label: "Exposed login endpoints", dork: "inurl:login OR inurl:signin OR inurl:auth" },
      { label: "Admin areas", dork: "inurl:admin OR inurl:dashboard" },
      { label: "Public staging environments", dork: "inurl:staging OR inurl:preprod OR inurl:uat" },
      { label: "Status pages", dork: "intitle:\"status page\" OR inurl:status" },
      { label: "Subdomain references", dork: "intext:\"api.\" OR intext:\"dev.\"" },
      { label: "Sitemap intelligence", dork: "inurl:sitemap.xml OR inurl:sitemap_index.xml" }
    ]
  },
{ type: "sec", category: "Exposed Documents", icon: "fa-file-alt", color: "#ff0066", items: [
  { label: "PDF documents", dork: "filetype:pdf" },
  { label: "Spreadsheets", dork: "filetype:xls OR filetype:xlsx OR filetype:csv" },
  { label: "Word documents", dork: "filetype:doc OR filetype:docx" },
  { label: "Presentations", dork: "filetype:ppt OR filetype:pptx" },
  { label: "Text notes", dork: "filetype:txt OR filetype:md" },
  { label: "Open directories", dork: "intitle:\"index of\"" },
 { label: "Site-specific confidential PDFs", dork: "intitle:\"confidential\" filetype:pdf" },
]},
  { type: "sec", category: "Cloud Storage Exposure", icon: "fa-cloud", color: "#0099ff", items: [
    { label: "Amazon S3 references", dork: "inurl:s3.amazonaws.com" },
    { label: "Azure Blob references", dork: "inurl:blob.core.windows.net" },
    { label: "Google Cloud storage refs", dork: "inurl:storage.googleapis.com" },
    { label: "Cloudfront buckets", dork: "inurl:cloudfront.net intext:bucket" },
    { label: "Public object listings", dork: "intitle:\"index of\" intext:\"bucket\"" },
    { label: "Misconfigured storage", dork: "intext:\"s3:PutObject\" filetype:json" }
  ]},
  { type: "sec", category: "Source Code Exposure", icon: "fa-code", color: "#ffcc00", items: [
    { label: "Git metadata", dork: "inurl:.git/config" },
    { label: "Gitignore files", dork: "filename:.gitignore" },
    { label: "Composer files", dork: "filename:composer.json" },
    { label: "Package lock files", dork: "filename:package-lock.json OR filename:yarn.lock" },
    { label: "Docker compose files", dork: "filename:docker-compose.yml" },
    { label: "CI config files", dork: "filename:.github/workflows OR filename:.gitlab-ci.yml" }
  ]},
  { type: "sec", category: "Secrets & Tokens", icon: "fa-key", color: "#ff6b35", items: [
    { label: "API key references", dork: "intext:\"api_key\" OR intext:\"client_secret\"" },
    { label: "Bearer tokens", dork: "intext:\"Bearer eyJ\"" },
    { label: "Access token leaks", dork: "intext:\"access_token\"" },
    { label: "Private key blocks", dork: "intext:\"BEGIN PRIVATE KEY\"" },
    { label: "AWS key patterns", dork: "intext:\"AKIA\" OR intext:\"aws_secret_access_key\"" },
    { label: "Webhook secrets", dork: "intext:\"webhook_secret\"" }
  ]},
  { type: "sec", category: "Server Config Leaks", icon: "fa-server", color: "#00d4ff", items: [
    { label: "Environment files", dork: "filename:.env" },
    { label: "INI and conf files", dork: "filetype:ini OR filetype:conf OR filetype:cnf" },
    { label: "Nginx config snippets", dork: "filetype:conf intext:server_name" },
    { label: "Apache virtual host files", dork: "filetype:conf intext:VirtualHost" },
    { label: "YAML service configs", dork: "filetype:yml intext:apiVersion" },
    { label: "Tomcat users files", dork: "filename:tomcat-users.xml" }
  ]},
  { type: "sec", category: "Logs & Debug Output", icon: "fa-bug", color: "#ff1744", items: [
    { label: "Application logs", dork: "filetype:log intext:error" },
    { label: "Stack traces", dork: "intext:\"Exception in thread\" OR intext:\"Traceback\"" },
    { label: "SQL error traces", dork: "intext:\"SQL syntax\" OR intext:\"mysql_fetch\"" },
    { label: "Debug mode enabled", dork: "intext:\"APP_DEBUG=true\"" },
    { label: "Verbose API errors", dork: "intext:\"stack\" intext:\"message\" filetype:json" },
    { label: "Unhandled exception pages", dork: "intitle:\"Server Error\" intext:\"Exception\"" }
  ]},
  { type: "sec", category: "Database Exposure", icon: "fa-database", color: "#00e676", items: [
    { label: "SQL dumps", dork: "filetype:sql intext:\"CREATE TABLE\"" },
    { label: "Database backups", dork: "filetype:bak OR filetype:dump" },
    { label: "SQLite files", dork: "filetype:sqlite OR filetype:db" },
    { label: "Mongo exports", dork: "filetype:json intext:\"_id\" intext:\"$date\"" },
    { label: "PostgreSQL dumps", dork: "filetype:sql intext:\"PostgreSQL database dump\"" },
    { label: "Redis dump files", dork: "filetype:rdb" }
  ]},
  { type: "sec", category: "Backup & Archive Discovery", icon: "fa-archive", color: "#f50057", items: [
    { label: "ZIP backups", dork: "filetype:zip (backup OR dump)" },
    { label: "TAR archives", dork: "filetype:tar OR filetype:tar.gz backup" },
    { label: "RAR archives", dork: "filetype:rar backup" },
    { label: "Old copies", dork: "filetype:old OR filetype:orig OR filetype:swp" },
    { label: "Site snapshots", dork: "inurl:backup OR inurl:old_site" },
    { label: "Daily backup naming", dork: "intext:backup_202" }
  ]},
  { type: "sec", category: "Admin Panel Discovery", icon: "fa-user-shield", color: "#00ff88", items: [
    { label: "Common admin paths", dork: "inurl:admin OR inurl:administrator" },
    { label: "CMS login portals", dork: "inurl:wp-login.php OR inurl:user/login" },
    { label: "Control panel pages", dork: "intitle:\"Control Panel\"" },
    { label: "cPanel interfaces", dork: "inurl:cpanel OR intitle:cPanel" },
    { label: "Plesk panels", dork: "intitle:Plesk" },
    { label: "Dashboard URLs", dork: "inurl:/dashboard" }
  ]},
  { type: "sec", category: "API Reconnaissance", icon: "fa-plug", color: "#ff00ff", items: [
    { label: "Swagger UI", dork: "inurl:swagger OR inurl:api-docs" },
    { label: "OpenAPI files", dork: "filetype:json intext:\"openapi\"" },
    { label: "GraphQL endpoints", dork: "inurl:graphql" },
    { label: "REST endpoint lists", dork: "intext:\"/api/v1/\"" },
    { label: "API key docs", dork: "intext:\"x-api-key\"" },
    { label: "Postman collections", dork: "filetype:json intext:\"postman_collection\"" }
  ]},
  { type: "sec", category: "Authentication Flows", icon: "fa-lock", color: "#00bfff", items: [
    { label: "Password reset pages", dork: "inurl:reset-password OR inurl:forgot-password" },
    { label: "SSO pages", dork: "inurl:sso OR inurl:saml" },
    { label: "OAuth callback URLs", dork: "inurl:oauth OR inurl:callback" },
    { label: "MFA setup pages", dork: "inurl:mfa OR inurl:2fa" },
    { label: "Session-related parameters", dork: "inurl:sessionid= OR inurl:token=" },
    { label: "Auth debug pages", dork: "intext:\"auth debug\"" }
  ]},
  { type: "sec", category: "Network Services", icon: "fa-network-wired", color: "#ffd700", items: [
    { label: "Exposed Elasticsearch", dork: "intitle:\"You Know, for Search\"" },
    { label: "Kibana dashboards", dork: "intitle:Kibana" },
    { label: "Prometheus metrics", dork: "inurl:/metrics" },
    { label: "Grafana login", dork: "intitle:Grafana inurl:login" },
    { label: "Jenkins instances", dork: "intitle:\"Dashboard [Jenkins]\"" },
    { label: "RabbitMQ panel", dork: "intitle:RabbitMQ inurl:15672" }
  ]},
  { type: "sec", category: "IoT Exposure", icon: "fa-microchip", color: "#ff4081", items: [
    { label: "Webcam interfaces", dork: "intitle:\"IP Camera\" OR inurl:/view/view.shtml" },
    { label: "Router admin UIs", dork: "intitle:\"router login\"" },
    { label: "NAS portals", dork: "intitle:\"NAS\" inurl:login" },
    { label: "Smart building dashboards", dork: "intext:\"building management system\"" },
    { label: "Industrial HMI pages", dork: "intitle:HMI inurl:scada" },
    { label: "NVR interfaces", dork: "intitle:NVR inurl:login" }
  ]},
  { type: "sec", category: "Container & Orchestration", icon: "fa-cubes", color: "#00e5ff", items: [
    { label: "Kubernetes dashboards", dork: "intitle:\"Kubernetes Dashboard\"" },
    { label: "Docker API references", dork: "intext:\"Docker API\"" },
    { label: "Helm charts", dork: "filetype:yaml intext:\"chart:\"" },
    { label: "Kube config files", dork: "filename:config intext:\"clusters:\" intext:\"users:\"" },
    { label: "Container registry configs", dork: "intext:\"registry\" filetype:yml" },
    { label: "Compose project files", dork: "filename:docker-compose" }
  ]},
  { type: "sec", category: "Threat Intelligence", icon: "fa-shield-virus", color: "#ff6e40", items: [
    { label: "Incident reports", dork: "filetype:pdf intext:\"incident response\"" },
    { label: "Ransomware advisories", dork: "intext:ransomware filetype:pdf" },
    { label: "IOC lists", dork: "intext:\"indicators of compromise\" filetype:txt" },
    { label: "Malware analysis reports", dork: "intext:\"malware analysis\" filetype:pdf" },
    { label: "Threat actor profiles", dork: "intext:\"threat actor\"" },
    { label: "CVE bulletins", dork: "intext:CVE-202" }
  ]},
  { type: "sec", category: "Vulnerability Research", icon: "fa-search-plus", color: "#76ff03", items: [
    { label: "XSS parameter candidates", dork: "inurl:q= OR inurl:search= OR inurl:query=" },
    { label: "Open redirect parameters", dork: "inurl:redirect= OR inurl:return= OR inurl:url=" },
    { label: "LFI parameter patterns", dork: "inurl:file= OR inurl:path= OR inurl:include=" },
    { label: "Upload forms", dork: "inurl:upload OR intext:\"type=\"file\"\"" },
    { label: "Potential SSRF parameters", dork: "inurl:url= OR inurl:dest= OR inurl:feed=" },
    { label: "Debug endpoints", dork: "inurl:debug OR inurl:console" }
  ]},
  { type: "sec", category: "Email & Contact Footprint", icon: "fa-at", color: "#ff1493", items: [
    { label: "Public email addresses", dork: "intext:\"@\" \"contact\"" },
    { label: "Contact pages", dork: "inurl:contact OR inurl:support" },
    { label: "Phone number references", dork: "intext:\"+1\" OR intext:\"+44\"" },
    { label: "Help desk portals", dork: "intitle:\"Help Center\" OR intitle:\"Support\"" },
    { label: "Security contacts", dork: "intext:\"security@\"" },
    { label: "PGP key pages", dork: "intext:\"BEGIN PGP PUBLIC KEY BLOCK\"" }
  ]},
  { type: "sec", category: "Supply Chain Visibility", icon: "fa-link", color: "#00ffff", items: [
    { label: "Vendor portals", dork: "inurl:vendor OR inurl:supplier" },
    { label: "Third-party integrations", dork: "intext:\"powered by\"" },
    { label: "Dependency manifests", dork: "filename:requirements.txt OR filename:pom.xml" },
    { label: "SBOM files", dork: "intext:\"software bill of materials\" OR filename:sbom" },
    { label: "Partner login", dork: "inurl:partner login" },
    { label: "External API docs", dork: "intext:\"integration guide\" inurl:api" }
  ]},
  { type: "sec", category: "Brand Monitoring", icon: "fa-bullhorn", color: "#ff9100", items: [
    { label: "Brand mentions in leaks", dork: "intext:\"leaked\" OR intext:\"breach\"" },
    { label: "Clone login pages", dork: "intitle:\"sign in\" intext:\"secure account\"" },
    { label: "Typosquatting clues", dork: "intext:\"did you mean\" OR intext:\"similar domain\"" },
    { label: "Credential phishing pages", dork: "intext:\"verify your account\"" },
    { label: "Fake support pages", dork: "intitle:\"customer support\" intext:\"call now\"" },
    { label: "Brand + malware", dork: "intext:malware OR intext:trojan" }
  ]},
  { type: "sec", category: "Mobile App OSINT", icon: "fa-mobile-alt", color: "#2196f3", items: [
    { label: "APK references", dork: "filetype:apk" },
    { label: "Android manifest leaks", dork: "filename:AndroidManifest.xml" },
    { label: "iOS plist files", dork: "filetype:plist" },
    { label: "Firebase config clues", dork: "intext:\"firebaseio.com\"" },
    { label: "Mobile API endpoints", dork: "intext:\"/mobile/api/\"" },
    { label: "App deep link docs", dork: "intext:\"deeplink\" OR intext:\"universal link\"" }
  ]},
  { type: "sec", category: "Compliance & Audit Artifacts", icon: "fa-clipboard-check", color: "#00ff00", items: [
    { label: "Security policy documents", dork: "filetype:pdf intext:\"information security policy\"" },
    { label: "Penetration test reports", dork: "filetype:pdf intext:\"penetration test\"" },
    { label: "SOC audit references", dork: "intext:\"SOC 2\" filetype:pdf" },
    { label: "ISO 27001 docs", dork: "intext:\"ISO 27001\" filetype:pdf" },
    { label: "Risk assessment templates", dork: "intext:\"risk assessment\" filetype:xls" },
    { label: "Business continuity plans", dork: "intext:\"business continuity\" filetype:pdf" }
  ]},
  { type: "sec", category: "Darkweb & Leak Watch", icon: "fa-user-secret", color: "#9c27b0", items: [
    { label: "Credential paste references", dork: "intext:\"paste\" intext:\"username\" intext:\"password\"" },
    { label: "Forum dump mentions", dork: "intext:\"database dump\"" },
    { label: "Compromised account notices", dork: "intext:\"compromised account\"" },
    { label: "Leak tracker posts", dork: "intext:\"data leak\"" },
    { label: "Stolen data sale mentions", dork: "intext:\"selling database\"" },
    { label: "Victim disclosure pages", dork: "intext:\"public disclosure\" breach" }
  ]},
  { type: "sec", category: "People & Organization OSINT", icon: "fa-users", color: "#ff5722", items: [
    { label: "Org chart files", dork: "filetype:pdf intext:\"organizational chart\"" },
    { label: "Employee directories", dork: "filetype:xls intext:employee directory" },
    { label: "Job postings", dork: "inurl:careers OR inurl:jobs" },
    { label: "Team pages", dork: "inurl:team OR inurl:about-us" },
    { label: "Press kit", dork: "inurl:press OR inurl:media-kit" },
    { label: "Leadership profiles", dork: "intext:\"Chief Information Security Officer\"" }
  ]},
  { type: "sec", category: "Burp Suite & Proxies", icon: "fa-shield-alt", color: "#00d9ff", items: [
    { label: "Burp Collaborator DNS logs", dork: "intext:burpcollaborator OR inurl:burp.oast" },
    { label: "Exposed proxy logs", dork: "filetype:log intext:proxy" },
    { label: "Request/response dumps", dork: "filetype:txt intext:HTTP/1.1" },
    { label: "BurpSuite state files", dork: "filename:.burp filename:state" },
    { label: "Mitmproxy captures", dork: "filetype:mitm" },
    { label: "Charles proxy sessions", dork: "filename:.chls" }
  ]},
  { type: "sec", category: "Nessus & Vulnerability Scans", icon: "fa-exclamation-triangle", color: "#ffeb3b", items: [
    { label: "Nessus reports", dork: "filetype:nessus OR filetype:pdf intext:Nessus" },
    { label: "Qualys scan exports", dork: "filetype:csv intext:Qualys" },
    { label: "OpenVAS results", dork: "filetype:xml intext:openvas" },
    { label: "Rapid7 InsightVM exports", dork: "filetype:csv intext:InsightVM" },
    { label: "Vulnerability summaries", dork: "filetype:pdf \"vulnerability assessment\"" },
    { label: "Scan snapshots", dork: "intext:CVSS score filetype:txt" }
  ]},
  { type: "sec", category: "Werkzeug & Flask Debug", icon: "fa-tools", color: "#3f51b5", items: [
    { label: "Werkzeug debuggers", dork: "intitle:\"Werkzeug\" inurl:debugger" },
    { label: "Flask debug errors", dork: "intitle:\"ValueError\" intext:Flask" },
    { label: "Python stack traces", dork: "intext:\"Traceback\" intext:\"File\"" },
    { label: "Django debug pages", dork: "intitle:\"Page not found\" intext:Django" },
    { label: "Interactive console access", dork: "inurl:console" },
    { label: "Python REPL exposed", dork: "intext:\">>>\" intext:Python" }
  ]},
  { type: "sec", category: "JIRA & Project Management", icon: "fa-tasks", color: "#e91e63", items: [
    { label: "JIRA instances", dork: "inurl:jira OR inurl:browse/PROJ" },
    { label: "Confluence wikis", dork: "inurl:confluence OR inurl:wiki" },
    { label: "Kanboard portals", dork: "inurl:kanboard" },
    { label: "Asana project pages", dork: "inurl:app.asana.com" },
    { label: "GitLab issues", dork: "inurl:gitlab.com/*/issues" },
    { label: "GitHub projects", dork: "inurl:github.com/*/projects" }
  ]},
  { type: "sec", category: "Slack & Chat Leaks", icon: "fa-comments", color: "#009688", items: [
    { label: "Slack workspace hints", dork: "intext:\"slack.com\" OR intext:\"slackapi.com\"" },
    { label: "Slack tokens", dork: "intext:\"xoxb-\" OR intext:\"xoxp-\"" },
    { label: "Discord webhooks", dork: "intext:\"discordapp.com/api/webhooks\"" },
    { label: "Telegram bot tokens", dork: "intext:\"bot\" intext:\"telegram\"" },
    { label: "Mattermost instances", dork: "inurl:mattermost" },
    { label: "Rocket.Chat servers", dork: "inurl:rocket.chat" }
  ]},

  // MEDIA DORKS
  { type: "media", category: "General Web File Finder", icon: "fa-folder-open", color: "#00ff41", items: [
    { label: "Open file indexes", dork: "intitle:\"index of\"" },
    { label: "PDF files", dork: "filetype:pdf" },
    { label: "Documents (DOC)", dork: "filetype:doc OR filetype:docx" },
    { label: "Spreadsheets", dork: "filetype:xls OR filetype:xlsx" },
    { label: "Presentations", dork: "filetype:ppt OR filetype:pptx" },
    { label: "Compressed archives", dork: "filetype:zip OR filetype:rar" }
  ]},
{
  type: "media",
  category: "Movies & TV Series",
  icon: "fa-film",
  color: "#e91e63",
  items: [
    {
      label: "HD Movies & Series (720p/1080p)",
      dork: 'intitle:"index of" (mkv|mp4) (1080p|720p) -html -htm'
    },
    {
      label: "Recent releases (2024-2026)",
      dork: 'intitle:"index of" mp4 (2024|2025|2026) -html'
    },
    {
      label: "4K Ultra HD content",
      dork: 'intitle:"index of" (mkv|mp4) (2160p|4K|UHD) -html'
    },
    {
      label: "TV Series (Seasons/Episodes)",
      dork: 'intitle:"index of" ("S01"|E01|Season) (mkv|mp4) -html'
    },
    {
      label: "Netflix originals",
      dork: 'intitle:"index of" netflix (mkv|mp4) -html -login'
    },
    {
      label: "Marvel & DC movies",
      dork: 'intitle:"index of" (marvel|dc) (mkv|mp4) -html'
    },
    {
      label: "Anime series & movies",
      dork: 'intitle:"index of" anime (mkv|mp4) -html'
    }
  ]
},




  { type: "media", category: "Academic Research", icon: "fa-graduation-cap", color: "#ff0066", items: [
    { label: "Scholarly PDFs", dork: "filetype:pdf (abstract OR references)" },
    { label: "Thesis documents", dork: "filetype:pdf (thesis OR dissertation)" },
    { label: "Lecture notes", dork: "filetype:pdf \"lecture notes\"" },
    { label: "Open textbooks", dork: "filetype:pdf \"open textbook\"" },
    { label: "University repositories", dork: "site:.edu inurl:repository" },
    { label: "Research datasets", dork: "filetype:csv OR filetype:xlsx \"dataset\"" }
  ]},
  { type: "media", category: "Journalism & News Archive", icon: "fa-newspaper", color: "#0099ff", items: [
    { label: "Press releases", dork: "inurl:press-release OR inurl:newsroom" },
    { label: "News archive pages", dork: "inurl:archive site:news" },
    { label: "Official statements", dork: "filetype:pdf \"official statement\"" },
    { label: "Media kits", dork: "inurl:media-kit OR inurl:press-kit" },
    { label: "Interview transcripts", dork: "filetype:pdf \"interview transcript\"" },
    { label: "Fact-check resources", dork: "inurl:fact-check" }
  ]},
  { type: "media", category: "Public Records", icon: "fa-landmark", color: "#ffcc00", items: [
    { label: "Government PDFs", dork: "site:.gov filetype:pdf" },
    { label: "Public procurement docs", dork: "filetype:pdf \"request for proposal\"" },
    { label: "Budget reports", dork: "filetype:pdf \"annual budget\"" },
    { label: "Public notices", dork: "inurl:public-notice" },
    { label: "Regulation documents", dork: "filetype:pdf regulation" },
    { label: "Court record indexes", dork: "inurl:court records" }
  ]},
  { type: "media", category: "People Search", icon: "fa-id-card", color: "#ff6b35", items: [
    { label: "Professional profiles", dork: "site:linkedin.com/in" },
    { label: "Personal pages", dork: "inurl:about-me OR inurl:portfolio" },
    { label: "Interview bios", dork: "intext:\"bio\" intext:\"speaker\"" },
    { label: "Conference attendee lists", dork: "filetype:pdf \"attendee list\"" },
    { label: "Alumni directories", dork: "inurl:alumni directory" },
    { label: "Contact pages", dork: "inurl:contact" }
  ]},
  { type: "media", category: "Company Intelligence", icon: "fa-building", color: "#00d4ff", items: [
    { label: "Annual reports", dork: "filetype:pdf \"annual report\"" },
    { label: "Investor presentations", dork: "filetype:ppt OR filetype:pdf \"investor presentation\"" },
    { label: "Org structure docs", dork: "filetype:pdf \"organizational structure\"" },
    { label: "Vendor list clues", dork: "filetype:xls \"vendor\"" },
    { label: "Policy handbooks", dork: "filetype:pdf \"employee handbook\"" },
    { label: "Compliance statements", dork: "filetype:pdf \"code of conduct\"" }
  ]},
  { type: "media", category: "Social Media Discovery", icon: "fa-hashtag", color: "#ff1744", items: [
    { label: "X / Twitter profiles", dork: "site:x.com OR site:twitter.com" },
    { label: "Instagram profiles", dork: "site:instagram.com" },
    { label: "YouTube channels", dork: "site:youtube.com/channel" },
    { label: "Reddit communities", dork: "site:reddit.com/r" },
    { label: "TikTok profiles", dork: "site:tiktok.com/@" },
    { label: "Mastodon handles", dork: "intext:\"@\" inurl:mastodon" }
  ]},
  { type: "media", category: "Code & Open Projects", icon: "fa-laptop-code", color: "#00e676", items: [
    { label: "GitHub repos", dork: "site:github.com" },
    { label: "GitLab projects", dork: "site:gitlab.com" },
    { label: "Public gists", dork: "site:gist.github.com" },
    { label: "Open source docs", dork: "filetype:md \"contributing\"" },
    { label: "Changelog files", dork: "filename:CHANGELOG.md" },
    { label: "Roadmaps", dork: "intext:\"project roadmap\"" }
  ]},
  { type: "media", category: "Image & Visual OSINT", icon: "fa-image", color: "#f50057", items: [
    { label: "Satellite map resources", dork: "intext:\"satellite imagery\"" },
    { label: "Infographics", dork: "filetype:png OR filetype:svg \"infographic\"" },
    { label: "Architectural plans", dork: "filetype:pdf \"floor plan\"" },
    { label: "Public event galleries", dork: "inurl:gallery \"event\"" },
    { label: "Brand assets", dork: "inurl:brand-guidelines filetype:pdf" },
    { label: "Design mockups", dork: "filetype:psd OR filetype:ai" }
  ]},
  { type: "media", category: "Maps & Geolocation", icon: "fa-map", color: "#00ff88", items: [
    { label: "Open map datasets", dork: "filetype:geojson OR filetype:kml" },
    { label: "GIS documents", dork: "filetype:pdf \"GIS\"" },
    { label: "Transportation maps", dork: "filetype:pdf \"route map\"" },
    { label: "Zoning maps", dork: "filetype:pdf \"zoning map\"" },
    { label: "Cadastral records", dork: "intext:\"cadastral\" filetype:pdf" },
    { label: "Topographic resources", dork: "filetype:pdf topographic map" }
  ]},
  { type: "media", category: "Legal & Policy Docs", icon: "fa-balance-scale", color: "#ff00ff", items: [
    { label: "Terms and conditions", dork: "inurl:terms OR inurl:tos" },
    { label: "Privacy policies", dork: "inurl:privacy-policy" },
    { label: "Licensing agreements", dork: "filetype:pdf license agreement" },
    { label: "Open data licenses", dork: "intext:\"Creative Commons\"" },
    { label: "Contract templates", dork: "filetype:doc OR filetype:pdf contract template" },
    { label: "Regulatory guidance", dork: "filetype:pdf \"regulatory guidance\"" }
  ]},
  { type: "media", category: "Cybersecurity Learning", icon: "fa-shield-alt", color: "#00bfff", items: [
    { label: "CTF writeups", dork: "intext:\"CTF writeup\"" },
    { label: "Blue team playbooks", dork: "filetype:pdf \"incident response playbook\"" },
    { label: "SOC runbooks", dork: "intext:\"SOC runbook\"" },
    { label: "Security checklists", dork: "filetype:pdf \"security checklist\"" },
    { label: "Training labs", dork: "inurl:lab \"cybersecurity\"" },
    { label: "Awareness material", dork: "filetype:ppt \"security awareness\"" }
  ]},
  { type: "media", category: "Finance & Procurement", icon: "fa-chart-line", color: "#ffd700", items: [
    { label: "Financial statements", dork: "filetype:pdf \"financial statement\"" },
    { label: "Tender documents", dork: "filetype:pdf tender" },
    { label: "Invoice templates", dork: "filetype:xls invoice template" },
    { label: "Grant opportunities", dork: "intext:\"grant application\"" },
    { label: "Tax guides", dork: "filetype:pdf tax guide" },
    { label: "Procurement policies", dork: "filetype:pdf procurement policy" }
  ]},
  { type: "media", category: "Health & Public Data", icon: "fa-notes-medical", color: "#ff4081", items: [
    { label: "Health bulletins", dork: "filetype:pdf \"health bulletin\"" },
    { label: "Epidemiology reports", dork: "filetype:pdf \"epidemiological report\"" },
    { label: "Medical guideline docs", dork: "filetype:pdf \"clinical guideline\"" },
    { label: "Hospital annual reports", dork: "filetype:pdf \"hospital annual report\"" },
    { label: "Public health datasets", dork: "filetype:csv \"public health\"" },
    { label: "Vaccination resources", dork: "filetype:pdf vaccination" }
  ]},
  { type: "media", category: "Travel & Transport Intel", icon: "fa-plane", color: "#00e5ff", items: [
    { label: "Airport advisories", dork: "filetype:pdf airport advisory" },
    { label: "Port authority notices", dork: "intext:\"port authority\" filetype:pdf" },
    { label: "Timetable documents", dork: "filetype:pdf timetable" },
    { label: "Transit plans", dork: "filetype:pdf \"transportation plan\"" },
    { label: "Tourism open data", dork: "filetype:csv tourism" },
    { label: "Travel warnings", dork: "intext:\"travel advisory\"" }
  ]},
  { type: "media", category: "Environment & Climate", icon: "fa-leaf", color: "#ff6e40", items: [
    { label: "Climate reports", dork: "filetype:pdf \"climate report\"" },
    { label: "Sustainability plans", dork: "filetype:pdf sustainability plan" },
    { label: "Environmental impact studies", dork: "filetype:pdf \"environmental impact assessment\"" },
    { label: "Air quality data", dork: "filetype:csv \"air quality\"" },
    { label: "Water quality reports", dork: "filetype:pdf \"water quality\"" },
    { label: "Carbon disclosures", dork: "filetype:pdf \"carbon disclosure\"" }
  ]},
  { type: "media", category: "Education Resources", icon: "fa-book-reader", color: "#76ff03", items: [
    { label: "Classroom materials", dork: "filetype:pdf \"lesson plan\"" },
    { label: "Open courseware", dork: "inurl:open-courseware" },
    { label: "Exam guides", dork: "filetype:pdf exam guide" },
    { label: "Curriculum outlines", dork: "filetype:pdf curriculum" },
    { label: "Teacher handbooks", dork: "filetype:pdf teacher handbook" },
    { label: "Student projects", dork: "filetype:ppt student project" }
  ]},
  { type: "media", category: "Books & Libraries", icon: "fa-book", color: "#ff1493", items: [
    { label: "Open library catalogs", dork: "inurl:opac OR inurl:library catalog" },
    { label: "Digitized books", dork: "filetype:pdf \"digitized by\"" },
    { label: "Book metadata files", dork: "filetype:xml \"dc:title\"" },
    { label: "Reading lists", dork: "filetype:pdf \"reading list\"" },
    { label: "Bibliographies", dork: "filetype:pdf bibliography" },
    { label: "Literary archives", dork: "inurl:archive \"literature\"" }
  ]},
  { type: "media", category: "Podcasts & Audio", icon: "fa-podcast", color: "#00ffff", items: [
    { label: "Podcast RSS feeds", dork: "inurl:podcast filetype:xml" },
    { label: "Audio transcripts", dork: "filetype:txt OR filetype:pdf \"transcript\"" },
    { label: "Interview audio files", dork: "filetype:mp3 interview" },
    { label: "Conference recordings", dork: "filetype:mp3 OR filetype:wav conference" },
    { label: "Public radio archives", dork: "inurl:radio archive" },
    { label: "Speech datasets", dork: "filetype:csv speech dataset" }
  ]},
  { type: "media", category: "Video Learning", icon: "fa-video", color: "#ff9100", items: [
    { label: "Recorded webinars", dork: "intext:webinar filetype:mp4" },
    { label: "Training recordings", dork: "intext:training video" },
    { label: "Conference talks", dork: "intext:\"conference talk\"" },
    { label: "Tutorial playlists", dork: "site:youtube.com playlist tutorial" },
    { label: "Video transcripts", dork: "filetype:pdf \"video transcript\"" },
    { label: "Lecture videos", dork: "intext:\"lecture\" filetype:mp4" }
  ]},
  { type: "media", category: "Open Data Portals", icon: "fa-table", color: "#2196f3", items: [
    { label: "CSV datasets", dork: "filetype:csv dataset" },
    { label: "JSON datasets", dork: "filetype:json dataset" },
    { label: "Data catalog pages", dork: "inurl:data-catalog" },
    { label: "CKAN portals", dork: "inurl:dataset site:ckan" },
    { label: "Government open data", dork: "site:.gov inurl:opendata" },
    { label: "Data dictionaries", dork: "filetype:pdf \"data dictionary\"" }
  ]},
  { type: "media", category: "Communities & Forums", icon: "fa-comments", color: "#00ff00", items: [
    { label: "Niche discussion boards", dork: "inurl:forum" },
    { label: "Q&A communities", dork: "inurl:questions OR inurl:answers" },
    { label: "Technical communities", dork: "intext:\"community forum\"" },
    { label: "Local community pages", dork: "inurl:community" },
    { label: "Archived discussions", dork: "inurl:archive forum" },
    { label: "Announcements boards", dork: "inurl:announcements" }
  ]},
  { type: "media", category: "NGO & Humanitarian", icon: "fa-hands-helping", color: "#ff5722", items: [
    { label: "NGO reports", dork: "filetype:pdf \"annual report\" NGO" },
    { label: "Humanitarian assessments", dork: "filetype:pdf humanitarian assessment" },
    { label: "Aid program docs", dork: "filetype:pdf \"aid program\"" },
    { label: "Grant impact reports", dork: "filetype:pdf impact report" },
    { label: "Field situation updates", dork: "filetype:pdf \"situation report\"" },
    { label: "Community project briefs", dork: "filetype:pdf project brief" }
  ]},
  { type: "media", category: "Design & Brand Assets", icon: "fa-palette", color: "#00d9ff", items: [
    { label: "Brand guidelines", dork: "filetype:pdf \"brand guidelines\"" },
    { label: "Logo packs", dork: "filetype:svg OR filetype:ai logo" },
    { label: "Presentation templates", dork: "filetype:ppt template" },
    { label: "Icon sets", dork: "filetype:zip icons" },
    { label: "Style guide docs", dork: "filetype:pdf \"style guide\"" },
    { label: "Design systems", dork: "intext:\"design system\"" }
  ]},
  { type: "media", category: "Career & Recruitment", icon: "fa-briefcase", color: "#9c27b0", items: [
    { label: "Job descriptions", dork: "filetype:pdf \"job description\"" },
    { label: "Recruitment portals", dork: "inurl:careers" },
    { label: "Internship listings", dork: "intext:internship" },
    { label: "Hiring reports", dork: "filetype:pdf \"hiring report\"" },
    { label: "Talent directories", dork: "intext:\"talent directory\"" },
    { label: "Remote work policies", dork: "filetype:pdf \"remote work policy\"" }
  ]}
];

const state = {
  currentMode: 'sec',
  queryCount: Number(localStorage.getItem('queryCount') || 0)
};

// DOM Elements
const targetInput = document.getElementById('target');
const keywordInput = document.getElementById('keyword-input');
const dorksContainer = document.getElementById('dorks-container');
const queryText = document.getElementById('query-text');
const queryPreview = document.getElementById('query-preview');
const customDorkInput = document.getElementById('custom-dork-input');
const modal = document.getElementById('dork-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const queryCounter = document.getElementById('query-counter');

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOMContentLoaded - App Started');
  renderCategories();
  updateStats();
  setupEventListeners();
  refreshCounter();
});

function setupEventListeners() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const newMode = e.target.closest('.mode-btn').dataset.mode;
      switchMode(newMode);
    });
  });

  if (targetInput) {
    targetInput.addEventListener('keypress', e => e.key === 'Enter' && executeSearch());
  }
  if (keywordInput) {
    keywordInput.addEventListener('keypress', e => e.key === 'Enter' && executeSearch());
  }
  if (customDorkInput) {
    customDorkInput.addEventListener('keypress', e => e.key === 'Enter' && runCustomDork());
  }
  
  document.getElementById('search-dorks')?.addEventListener('keyup', filterDorks);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeDorkModal();
      }
    });
  }

  document.querySelector('.modal-close')?.addEventListener('click', closeDorkModal);
}

function switchMode(mode) {
  state.currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  
  const domainGroup = document.getElementById('domain-group');
  if (domainGroup) {
    domainGroup.style.display = mode === 'sec' ? 'block' : 'none';
  }

  document.querySelectorAll('.description-content').forEach(el => {
    el.classList.remove('active');
  });
  const descId = mode === 'sec' ? 'desc-sec' : 'desc-media';
  document.getElementById(descId)?.classList.add('active');

const modeDisplay = document.getElementById('mode-display');
if (modeDisplay) {
  modeDisplay.textContent = mode === 'sec' ? 'CYBER_INTEL' : 'FILE_HUNTER';
}

  
  renderCategories();
}


function renderCategories() {
  console.log('🔍 renderCategories llamada');
  console.log('🎯 Modo actual:', state.currentMode);
  
  if (!dorksContainer) {
    console.log('❌ dorksContainer no existe!');
    return;
  }
  
  dorksContainer.innerHTML = '';
  
  const categories = dorksData.filter(c => c.type === state.currentMode);
  console.log('📊 Categorías encontradas:', categories.length);
  
  if (categories.length === 0) {
    dorksContainer.innerHTML = '<p style="color: #ff0066; text-align: center; padding: 40px;">No hay categorías para este modo</p>';
    return;
  }
  
  categories.forEach((category, index) => {
    const card = document.createElement('div');
    card.className = 'dork-card';
    card.style.cursor = 'pointer';
    
    card.innerHTML = `
      <div class="dork-header">
        <div class="dork-icon" style="color: ${category.color}; background: ${category.color}20; border-color: ${category.color}40;">
          <i class="fas ${category.icon}"></i>
        </div>
      </div>
      <h3 class="dork-title">${category.category}</h3>
      <p class="dork-description">Explore ${category.items.length} dorks</p>
    `;
    
    card.addEventListener('click', () => {
      openModal(category);
    });
    
    dorksContainer.appendChild(card);
  });
  
  console.log('✅ Categorías renderizadas exitosamente');
}

function openModal(category) {
  if (!modal || !modalTitle || !modalBody) return;

  modalTitle.textContent = category.category;
  modalBody.innerHTML = '';
  
  category.items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'dork-list-item';
    
    div.innerHTML = `
      <div class="dork-list-header">
        <span class="dork-list-number">${index + 1}</span>
        <span class="dork-list-desc">${item.label}</span>
      </div>
      <code class="dork-list-query">${item.dork}</code>
      <div class="dork-item-actions">
        <button class="dork-item-btn primary" data-action="execute">
          <i class="fas fa-play"></i> Execute
        </button>
        <button class="dork-item-btn secondary" data-action="copy">
          <i class="fas fa-copy"></i> Copy
        </button>
      </div>
    `;
    
    // Event listeners seguros (sin onclick inline)
    const executeBtn = div.querySelector('[data-action="execute"]');
    const copyBtn = div.querySelector('[data-action="copy"]');
    
    executeBtn.addEventListener('click', () => {
      executeDork(item.dork);
    });
    
    copyBtn.addEventListener('click', () => {
      copyToClipboard(item.dork);
    });
    
    modalBody.appendChild(div);
  });
  
  modal.classList.remove('hidden');
  modal.classList.add('show');
}

function closeDorkModal() {
  if (modal) {
    modal.classList.remove('show');
    modal.classList.add('hidden');
  }
}

function filterDorks() {
  const query = (document.getElementById('search-dorks')?.value || '').toLowerCase();
  document.querySelectorAll('.dork-card').forEach(card => {
    const shouldShow = card.textContent.toLowerCase().includes(query);
    card.style.display = shouldShow ? '' : 'none';
  });
}

function getCleanDomain() {
  if (!targetInput) return '';
  return targetInput.value.trim().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toLowerCase();
}

function executeSearch() {
  const domain = state.currentMode === 'sec' ? getCleanDomain() : '';
  const keyword = (keywordInput?.value.trim() || '').toLowerCase();
  
  if (!domain && !keyword && state.currentMode === 'sec') {
    alert('Enter a domain or keyword');
    return;
  }
  
  let query = '';
  if (domain) query += `site:${domain} `;
  if (keyword) query += `"${keyword}"`;
  
  if (!query.trim()) {
    alert('Please enter search terms');
    return;
  }
  
  updateQueryPreview(query);
  openGoogle(query);
}

// ------------------------------------------------------------------
// FIXED FUNCTION: executeDork
// 1. Removed closeDorkModal() call to keep the modal open.
// 2. Ensures Google opens in a new tab.
// ------------------------------------------------------------------
function executeDork(dorkCode) {
  console.log(`⚡ Executing dork: ${dorkCode.substring(0, 50)}...`);
  
  const domain = state.currentMode === 'sec' ? getCleanDomain() : '';
  const keyword = (keywordInput?.value.trim() || '');
  
  let query = '';
  // Only append site:domain if not already present in the dork and a domain is provided
  if (domain && !dorkCode.includes('site:')) {
      query += `site:${domain} `;
  }
  
  // Append keyword if present
  if (keyword) {
      query += `"${keyword}" `;
  }
  
  query += dorkCode;
  
  updateQueryPreview(query.trim());
  
  
  openGoogle(query.trim());
}

function runCustomDork() {
  let query = customDorkInput?.value.trim();
  if (!query) {
    alert('Enter a custom dork');
    return;
  }
  
  const domain = state.currentMode === 'sec' ? getCleanDomain() : '';
  if (domain && !query.includes('site:')) {
    query = `site:${domain} ${query}`;
  }
  
  updateQueryPreview(query);
  openGoogle(query);
}

function openGoogle(query) {
  const encodedQuery = encodeURIComponent(query);
  const googleUrl = `https://www.google.com/search?q=${encodedQuery}`;
  window.open(googleUrl, '_blank', 'noopener,noreferrer');
  
  state.queryCount++;
  localStorage.setItem('queryCount', String(state.queryCount));
  refreshCounter();
}

function updateQueryPreview(query) {
  if (queryText) queryText.textContent = query;
  if (queryPreview) queryPreview.classList.remove('hidden');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ Copied to clipboard!', 'success');
  }).catch(err => {
    console.error('❌ Copy failed:', err);
    showToast('❌ Copy failed', 'error');
  });
}

function refreshCounter() {
  if (queryCounter) {
    queryCounter.textContent = `QUERIES: ${state.queryCount}`;
  }
}

document.getElementById('copy-btn')?.addEventListener('click', () => {
  const text = queryText?.textContent;
  if (text && text !== 'waiting...') {
    copyToClipboard(text);
  }
});

function updateStats() {
  const secCount = dorksData.filter(d => d.type === 'sec').length;
  const mediaCount = dorksData.filter(d => d.type === 'media').length;
  
  const totalElement = document.getElementById('total-dorks');
  const secElement = document.getElementById('sec-categories');
  const mediaElement = document.getElementById('media-categories');
  
  if (totalElement) totalElement.textContent = `${secCount + mediaCount}`;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-check"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}

window.addEventListener('scroll', () => {
  const btn = document.getElementById('scroll-top');
  if (btn) {
    btn.classList.toggle('visible', window.scrollY > 300);
  }
});

document.getElementById('scroll-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function insertOperator(op) {
  if (!customDorkInput) return;
  const start = customDorkInput.selectionStart;
  const end = customDorkInput.selectionEnd;
  const text = customDorkInput.value;
  const before = text.substring(0, start);
  const after = text.substring(end);
  
  customDorkInput.value = before + op + ' ' + after;
  customDorkInput.selectionStart = customDorkInput.selectionEnd = start + op.length + 1;
  customDorkInput.focus();
}

function loadExample(dorkText) {
  if (customDorkInput) {
    customDorkInput.value = dorkText;
    customDorkInput.focus();
  }
}
