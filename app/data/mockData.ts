export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
  author: string;
  readTime: number;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  username: string;
  content: string;
  date: string;
  reported: boolean;
  reportReason?: string;
  approved: boolean | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  isOwner: boolean;
  joinDate: string;
  oauth: { google: boolean; github: boolean };
}

export const USER_PASSWORDS: Record<string, string> = {
  owner: 'owner123',
  小明: 'user123',
  小花: 'user456',
};

export const MOCK_USERS: User[] = [
  {
    id: 'owner',
    username: 'owner',
    email: 'owner@blog.com',
    bio: '這個部落格的主人，熱愛技術與生活。',
    isOwner: true,
    joinDate: '2024-01-01',
    oauth: { google: false, github: false },
  },
  {
    id: 'user1',
    username: '小明',
    email: 'xiaoming@example.com',
    bio: '喜歡技術和旅遊的工程師。',
    isOwner: false,
    joinDate: '2024-06-15',
    oauth: { google: true, github: false },
  },
  {
    id: 'user2',
    username: '小花',
    email: 'xiaohua@example.com',
    bio: '美食愛好者，週末料理達人。',
    isOwner: false,
    joinDate: '2024-09-20',
    oauth: { google: false, github: true },
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: '新年的開始：2025年的計劃',
    excerpt: '新的一年，新的開始。今年我打算學習更多技術，同時也要多旅遊、多體驗生活...',
    content: `新的一年，新的開始。2025年對我來說是充滿期待的一年。

在技術方面，我計劃深入學習 React 和 TypeScript，同時也想探索 AI 相關的工具和框架。技術進步的速度越來越快，我需要不斷跟上時代的腳步。

在生活方面，我希望能多旅遊，今年的目標是去日本和東南亞各一次。旅遊不只是放鬆，更是拓展視野的機會。每一次旅行都能讓我看到不同的文化和生活方式，這對我的寫作和思考都有很大的幫助。

健康也是今年的重要目標。我打算每週至少運動三次，保持良好的作息習慣。畢竟身體是革命的本錢！

希望這一年能夠順利、充實，也希望每一位讀者都能在新的一年裡實現自己的目標。`,
    tags: ['生活', '計劃'],
    date: '2025-01-02',
    author: 'owner',
    readTime: 3,
  },
  {
    id: '2',
    title: 'React 18 新特性深度解析',
    excerpt: 'React 18 帶來了許多激動人心的新特性，包括 Concurrent Mode、Suspense 改進等...',
    content: `React 18 是 React 發展史上的一個重要里程碑，帶來了許多激動人心的新特性。

最重要的新特性之一是 Concurrent Mode（並發模式）的正式發布。這個模式允許 React 在渲染過程中暫停和恢復工作，從而讓應用更流暢地響應用戶交互。通過使用新的 \`startTransition\` API，我們可以將某些更新標記為非緊急，讓 React 優先處理更重要的更新。

Suspense 也得到了重大改進。現在不僅可以用於代碼分割，還可以用於數據獲取。配合新的 \`use\` hook，我們可以寫出更簡潔的異步代碼。

另一個值得關注的特性是自動批處理（Automatic Batching）。在 React 18 之前，只有在 React 事件處理函數中的狀態更新才會被批處理。現在，所有來源的更新（包括 setTimeout、Promise 等）都會被自動批處理，進一步提升性能。

總的來說，React 18 的這些改進都是為了讓開發者能夠構建更快、更流暢的用戶界面。如果你還沒有升級到 React 18，現在是時候考慮了！`,
    tags: ['技術', '前端', '程式設計'],
    date: '2025-01-15',
    author: 'owner',
    readTime: 6,
  },
  {
    id: '3',
    title: '東京三日遊：淺草、澀谷、新宿',
    excerpt: '終於實現了去東京的夢想！這次的旅行充滿了驚喜，從傳統的淺草到現代的澀谷...',
    content: `等了好久終於到東京了！這次三天兩夜的旅行讓我深刻感受到了日本文化的獨特魅力。

第一天，我從淺草開始。淺草寺是東京最古老的寺廟之一，遊客絡繹不絕。穿過雷門，走在仲見世通上，兩旁都是販賣傳統工藝品和小吃的店家。我買了一個漂亮的信籤組合和一些抹茶糕點。下午去了上野公園，順便參觀了東京國立博物館，看了一些珍貴的日本藝術品。

第二天前往澀谷。澀谷十字路口是全世界最繁忙的十字路口之一，站在那裡看著人潮四面八方地湧動，感覺非常震撼。去了澀谷 SCRAMBLE SQUARE 的頂層觀景台，可以360度欣賞東京的全景。晚上在澀谷的小巷子裡找到了一家超好吃的拉麵店，排隊等了30分鐘但完全值得！

第三天在新宿度過。參觀了新宿御苑，雖然不是賞楓季節，但園內的景色依然很美。下午逛了歌舞伎町旁邊的電器街，買了一些電子配件。

東京是一個讓人既感受到傳統又能體驗現代的城市，每個角落都有驚喜等待發現。已經在計劃下次的回訪了！`,
    tags: ['旅遊', '日本', '生活'],
    date: '2025-01-28',
    author: 'owner',
    readTime: 5,
  },
  {
    id: '4',
    title: 'TypeScript 5.0 新功能介紹',
    excerpt: 'TypeScript 5.0 帶來了許多令人興奮的新功能，讓我們一起來看看...',
    content: `TypeScript 5.0 是一個重要的版本更新，帶來了多項令人期待的新功能。

裝飾器（Decorators）終於有了官方支持。新的裝飾器實現符合 TC39 提案，比之前的實驗性版本更加穩定和強大。我們可以使用裝飾器來修改類、方法、訪問器、屬性和參數的行為。

const 類型參數是另一個重大改進。在泛型函數中使用 \`const\` 修飾符，可以讓 TypeScript 更精確地推斷字面量類型，避免類型被擴展到更寬泛的類型。

多個配置文件繼承也讓項目配置管理更加靈活。現在可以在 \`tsconfig.json\` 中的 \`extends\` 字段使用數組，從多個配置文件繼承設置。

另外，TypeScript 5.0 還改進了對打包工具（如 webpack、esbuild、Vite）的支持，新增了 \`bundler\` 模塊解析策略，更好地適應現代前端開發工作流。

TypeScript 的每個新版本都讓開發體驗更加愉快，期待未來更多的改進！`,
    tags: ['技術', '程式設計', '前端'],
    date: '2025-02-08',
    author: 'owner',
    readTime: 5,
  },
  {
    id: '5',
    title: '台南美食探索：牛肉湯和鱔魚意麵',
    excerpt: '台南是美食的天堂，這次特別為了吃而去了一趟台南，滿足了口腹之慾...',
    content: `說到台灣美食，不得不提台南。台南有著深厚的飲食文化，各種小吃和料理都讓人流連忘返。

早上六點就去排永樂牛肉湯的隊伍，這家店只開到賣完為止，通常中午就關門了。等了將近四十分鐘，終於坐下來喝到了那碗令人魂牽夢繞的牛肉湯。清澈的湯底鮮甜無比，薄切的牛肉嫩而不柴，配上一碗白飯，完美的台南早餐！

午餐去了家蚵仔煎老店，配料豐富，蚵仔飽滿，醬汁甜鹹適中。台南的蚵仔煎似乎比北部的更加Q彈。

下午嚐了幾家冰品：台南擔仔麵旁邊的古早味冰，還有著名的莉莉水果店，喝了一杯新鮮現打的木瓜牛奶。

晚餐是重頭戲——鱔魚意麵。這是台南特有的小吃，炒得香氣四溢的鱔魚配上軟硬適中的油炸意麵，酸甜鹹香的醬汁讓人回味無窮。一碗下肚，完全理解為什麼台南人這麼引以為傲。

台南不愧是台灣美食之都，下次還要再來！`,
    tags: ['美食', '旅遊', '生活'],
    date: '2025-02-22',
    author: 'owner',
    readTime: 4,
  },
  {
    id: '6',
    title: '閱讀《零秒思考》：提升思維速度的實踐',
    excerpt: '這本書徹底改變了我的思考和記錄方式，推薦給所有想要提升思考效率的人...',
    content: `《零秒思考》是一本由麥肯錫前顧問赤羽雄二所著的書籍，介紹了一種簡單但極為有效的思考方法——A4紙筆記法。

核心概念是每天用A4紙手寫筆記，每張紙只寫一個主題，在紙的上方寫下主題，然後在下方用一到六行寫下相關想法。每條想法要在1到2分鐘內完成，每個主題只花1分鐘思考。

剛開始實踐的時候，我發現自己很難在1分鐘內想出有價值的觀點，但隨著練習增多，思考確實變得越來越流暢。現在我每天早上都會花10-20分鐘做筆記，涵蓋工作上的問題、個人成長的反思、或是對某件事情的看法。

這個方法讓我最大的收穫是：把模糊的想法具體化的能力大幅提升。很多時候我們心裡有很多想法，但說不清楚。透過寫下來，思路變得更清晰，問題也更容易解決。

如果你覺得自己思考速度慢、表達不清晰，推薦你試試這個方法，堅持一個月就會看到顯著的改變。`,
    tags: ['書評', '生活', '成長'],
    date: '2025-03-05',
    author: 'owner',
    readTime: 4,
  },
  {
    id: '7',
    title: 'CSS Grid 和 Flexbox：何時使用哪個？',
    excerpt: '很多前端開發者對 Grid 和 Flexbox 的使用場景感到困惑，今天來徹底說清楚...',
    content: `CSS Grid 和 Flexbox 是現代 CSS 中兩個最重要的佈局工具，但很多開發者對應該在什麼時候用哪個感到困惑。

**Flexbox 的強項**

Flexbox 是一維佈局系統，最適合用於在一行或一列中排列元素、需要元素動態分配可用空間、對齊居中和分佈元素，以及導航列、工具欄、按鈕組等。

**Grid 的強項**

Grid 是二維佈局系統，最適合用於複雜的頁面佈局（行和列同時控制）、卡片網格和相冊展示，以及需要元素對齊到特定位置的場景。

**實際使用原則**

我的個人原則是：如果佈局主要在一個方向上（水平或垂直），用 Flexbox；如果需要同時控制行和列，用 Grid。

但實際上，兩者常常搭配使用：外層用 Grid 定義整體頁面結構，內層用 Flexbox 排列組件內的元素。

**新的 CSS 特性**

值得一提的是，現在 CSS 也支持 \`gap\` 屬性在 Flexbox 中使用了，不再需要用 margin 來設置元素間距。這讓 Flexbox 的使用更加方便。

希望這篇文章能幫助你更清楚地理解何時使用 Grid 和 Flexbox！`,
    tags: ['技術', '前端', '程式設計'],
    date: '2025-03-18',
    author: 'owner',
    readTime: 5,
  },
  {
    id: '8',
    title: '《寄生上流》重看有感',
    excerpt: '重看了這部獲得奧斯卡最佳影片的韓國電影，每次看都有新的感受...',
    content: `三年前第一次看《寄生上流》（Parasite）的時候，被它的劇情反轉震驚到說不出話。最近重看了一遍，發現有更多細節值得欣賞。

導演奉俊昊在電影中運用了大量的象徵手法。最明顯的是「地下」這個空間的隱喻——地下室代表著社會底層，無論多努力，總有人被困在下面。而「香味」這個元素的運用也非常精妙，窮人的氣味成了阻礙他們向上流動的無形屏障。

階級衝突是電影的核心主題，但奉俊昊並沒有簡單地將富人塑造成壞人、窮人塑造成受害者。每個角色都有其複雜性和人性的弱點。這種不站隊的敘事方式讓電影的批判更加有力。

重看之後，我注意到了更多第一次看時錯過的細節，比如前半段的諸多伏筆在後半段的呼應，以及雨水在電影中的象徵意義。

這確實是一部值得反覆品味的傑作。`,
    tags: ['電影', '生活'],
    date: '2025-03-29',
    author: 'owner',
    readTime: 5,
  },
  {
    id: '9',
    title: 'Node.js 後端開發入門指南',
    excerpt: '從零開始學習 Node.js 後端開發，涵蓋 Express、RESTful API 等核心概念...',
    content: `Node.js 讓 JavaScript 能在服務端運行，打破了前後端語言的壁壘。對前端開發者來說，學習 Node.js 後端是一個很自然的延伸。

**環境設置**

首先需要安裝 Node.js（推薦使用 nvm 管理版本）。接著初始化一個新項目，使用 Express 框架來建立路由和中間件。

**RESTful API 設計**

RESTful API 設計有幾個核心原則：使用 HTTP 方法（GET、POST、PUT、DELETE）表達操作意圖，URL 表示資源而不包含動詞，以及使用適當的 HTTP 狀態碼回應。

**中間件架構**

Express 的中間件模式非常靈活。你可以使用內建的 \`express.json()\` 解析請求體，使用 \`cors\` 處理跨域問題，以及自定義中間件進行身份驗證。

**資料庫整合**

對於初學者，MongoDB 配合 Mongoose ODM 是個不錯的選擇，文檔型資料庫更容易上手。若需要關聯型資料，PostgreSQL 配合 Prisma ORM 是更現代的選擇。

這只是個起點，Node.js 生態系統非常豐富，後續可以學習 JWT 認證、WebSocket 即時通訊、以及各種部署方案。`,
    tags: ['技術', '後端', '程式設計'],
    date: '2025-04-10',
    author: 'owner',
    readTime: 7,
  },
  {
    id: '10',
    title: '京都賞櫻：一個人的春日旅行',
    excerpt: '趁著賞櫻季節，一個人前往京都，漫步在哲學之道，感受日本最美的季節...',
    content: `四月初，獨自前往京都賞櫻。這是我第一次一個人出國旅行，既期待又有些緊張。

從大阪關西機場搭乘電車，約一小時後抵達京都。放下行李後立刻前往哲學之道——這條沿琵琶湖疏水道而建的小路，是京都最著名的賞櫻地點之一。

哲學之道兩旁的櫻花樹已經盛開，粉白色的花瓣在微風中輕輕飄落，落在水面上形成花瓣河。走在其中，有一種時間靜止的錯覺。整條路大約兩公里，我慢慢地走了近一個小時，不時停下來拍照。

第二天清早去了嵐山。天剛亮的嵐山遊客還不多，在竹林大道裡幾乎只有自己，寂靜中只有竹葉搖曳的聲音。橫跨大堰川的渡月橋倒映在水中，與背後的山和前景的櫻花相映成趣，構成了一幅完美的畫面。

一個人旅行的好處是完全按照自己的節奏。想停就停，想走就走，不需要配合任何人的行程。京都給我留下了難忘的印記，我想我還會再來。`,
    tags: ['旅遊', '日本', '生活'],
    date: '2025-04-22',
    author: 'owner',
    readTime: 5,
  },
  {
    id: '11',
    title: 'Vite vs Webpack：現代前端打包工具比較',
    excerpt: '為什麼越來越多的項目選擇 Vite 而不是 Webpack？深入分析兩者的優缺點...',
    content: `近年來，Vite 迅速成為前端開發者的新寵，很多人開始將項目從 Webpack 遷移到 Vite。讓我們來分析一下兩者的異同。

**開發體驗**

Vite 在開發環境下使用原生 ESM，讓瀏覽器直接解析模塊，而不是像 Webpack 那樣先打包所有文件。這意味著 Vite 的冷啟動速度要快得多——大型項目從 Webpack 的幾分鐘縮短到 Vite 的幾秒鐘。

**熱模塊替換（HMR）**

Vite 的 HMR 速度也遠超 Webpack。當你修改一個文件時，Vite 只需要更新那個模塊，而 Webpack 需要重新打包整個模塊樹的一部分。

**生產環境打包**

Vite 的生產環境打包使用的是 Rollup。Rollup 打包的產物通常比 Webpack 更小、更優化，並且對 Tree-shaking 的支持更好。

**我的建議**

新項目首選 Vite，開發體驗更好。舊項目如果遷移成本不高，也值得考慮。但如果項目有特殊需求或依賴 Webpack 特有功能，不必強行遷移。`,
    tags: ['技術', '前端', '程式設計'],
    date: '2025-05-07',
    author: 'owner',
    readTime: 6,
  },
  {
    id: '12',
    title: '居家料理：五道簡單又美味的義大利麵',
    excerpt: '學會這五道義大利麵，週末在家就能輕鬆做出餐廳水準的料理...',
    content: `義大利麵是我最喜歡自己做的料理之一，食材簡單、做法快速，但口味絕不馬虎。今天分享五道我最常做的義大利麵。

**1. 蒜香橄欖油義大利麵（Aglio e Olio）**
最簡單也最能體現食材本味的做法。大量蒜片和橄欖油是靈魂，辣椒片增加層次，最後撒上帕馬森乾酪和巴西里葉。

**2. 培根蛋義大利麵（Carbonara）**
真正的 Carbonara 不加奶油！只用蛋黃、起司、培根和黑胡椒。關鍵是不能讓蛋黃受熱過度，否則會變成炒蛋麵。

**3. 番茄肉醬麵（Bolognese）**
這個需要時間熬製，但完全值得。牛肉和豬肉混合，加番茄糊、紅酒，小火慢燉至少兩小時，肉醬會變得無比濃郁。

**4. 青醬麵（Pesto Genovese）**
新鮮羅勒葉、松子、蒜、帕馬森乾酪和橄欖油打成的青醬，拌麵或拌麵包都很棒。

**5. 番茄奶油蝦麵**
這是我自己改良的做法，番茄的酸配奶油的香，再加上彈牙的蝦子，非常適合週末的豐盛午餐。`,
    tags: ['美食', '生活'],
    date: '2025-05-21',
    author: 'owner',
    readTime: 5,
  },
  {
    id: '13',
    title: '我最近在聽的10張專輯',
    excerpt: '分享最近一個月反覆播放的音樂，從爵士到電子音樂，風格多元...',
    content: `音樂是我生活中不可或缺的一部分。最近在反覆聆聽幾張特別喜歡的專輯，想分享給大家。

**Bill Evans Trio - Waltz for Debby**
爵士鋼琴的教科書。Evans 的觸鍵輕柔細膩，和 Scott LaFaro 的貝斯呼應堪稱絕妙。這張現場錄音充滿了自發性和即興的魔力。

**Radiohead - OK Computer**
每隔幾年就會重新愛上這張專輯。那種未來主義的憂鬱感在現在聽來反而更加貼切。

**坂本龍一 - async**
生命中最後幾年的獨奏鋼琴作品，極簡卻深邃。在他辭世後再聽，更添一份感傷。

**Mac Miller - Swimming**
Mac Miller 最成熟的一張專輯，制作精良，歌詞深刻。雖然他已不在，但這張專輯好像他一直都在。

**Khruangbin - Mordechai**
泰國風格的融合音樂，節奏輕鬆，非常適合下午工作時聆聽。

聽音樂不只是娛樂，更是一種情感的出口。不同的心情適合不同的音樂，而好的音樂能讓你對生活有新的感悟。`,
    tags: ['音樂', '生活'],
    date: '2025-06-10',
    author: 'owner',
    readTime: 4,
  },
  {
    id: '14',
    title: '使用 Docker 容器化你的應用',
    excerpt: '從基礎開始學習 Docker，掌握容器化技術，讓你的應用部署更輕鬆...',
    content: `Docker 已經成為現代應用開發和部署的標準工具。容器化技術解決了「在我電腦上可以跑」的經典問題。

**Docker 基本概念**

映像檔（Image）是應用的藍圖，包含運行應用所需的一切。容器（Container）是映像檔的運行實例，相互隔離。Dockerfile 定義了如何構建映像檔的步驟。

**Dockerfile 基本結構**

一個典型的 Node.js Dockerfile 會從官方基礎映像開始，設定工作目錄，複製依賴文件並安裝，然後複製應用代碼，最後指定啟動命令。

**Docker Compose**

對於多服務的應用，Docker Compose 讓管理更加方便。只需一個 \`docker-compose.yml\` 文件就能定義和啟動所有服務，包括應用服務器、資料庫、快取服務等。

**部署考量**

容器化後，你的應用可以輕鬆部署到各種雲平台：AWS ECS、Google Cloud Run、Azure Container Instances，或者自己管理的 Kubernetes 集群。

容器化已經是現代開發的基本功，掌握 Docker 對你的職涯發展很有幫助。`,
    tags: ['技術', '後端', '程式設計'],
    date: '2025-06-25',
    author: 'owner',
    readTime: 6,
  },
  {
    id: '15',
    title: '2026年的技術展望',
    excerpt: 'AI、WebAssembly、邊緣計算...2026年的技術趨勢值得我們持續關注...',
    content: `2025年即將結束，是時候展望一下2026年的技術趨勢了。

**AI 整合將更加普及**

生成式 AI 不再只是噱頭，它已經深入到各種工作流程中。2026年，我們會看到更多「AI-first」的應用和服務，以及更好的 AI 工具整合到開發環境中。

**WebAssembly 的崛起**

WebAssembly（Wasm）讓高性能語言（C++、Rust、Python）可以在瀏覽器中運行。2026年，我們可能會看到更多複雜的桌面級應用移植到 Web 端。

**邊緣計算的成熟**

Cloudflare Workers、Vercel Edge Functions 等邊緣計算平台越來越強大。將計算移到離用戶更近的地方，可以顯著降低延遲、提升用戶體驗。

**Rust 繼續攻城略地**

Rust 的安全性和性能使它在系統程式設計領域越來越受歡迎。Linux 核心開始引入 Rust，Android 也在逐步整合。

無論技術如何變化，持續學習和適應的能力才是最重要的。讓我們一起迎接2026年的技術浪潮！`,
    tags: ['技術', '程式設計', '生活'],
    date: '2025-12-28',
    author: 'owner',
    readTime: 5,
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    articleId: '1',
    userId: 'user1',
    username: '小明',
    content: '新年快樂！你的2025計劃很棒，我也要好好規劃一下今年。',
    date: '2025-01-03',
    reported: false,
    approved: null,
  },
  {
    id: 'c2',
    articleId: '1',
    userId: 'user2',
    username: '小花',
    content: '加油！日本旅行記得分享照片。',
    date: '2025-01-04',
    reported: false,
    approved: null,
  },
  {
    id: 'c3',
    articleId: '2',
    userId: 'user1',
    username: '小明',
    content: '這篇關於 React 18 的介紹寫得很清楚！特別是自動批處理那段，之前一直不太理解。',
    date: '2025-01-16',
    reported: false,
    approved: null,
  },
  {
    id: 'c4',
    articleId: '3',
    userId: 'user2',
    username: '小花',
    content: '好羨慕你去東京！我也想去，哪家拉麵店好吃呢？',
    date: '2025-01-30',
    reported: false,
    approved: null,
  },
  {
    id: 'c5',
    articleId: '3',
    userId: 'user1',
    username: '小明',
    content: '東京真的很棒，去過三次了還是想再去！',
    date: '2025-01-31',
    reported: false,
    approved: null,
  },
  {
    id: 'c6',
    articleId: '7',
    userId: 'user1',
    username: '小明',
    content: '終於有人說清楚這個問題了！我一直在這兩個之間搖擺不定。',
    date: '2025-03-20',
    reported: false,
    approved: null,
  },
  {
    id: 'c7',
    articleId: '10',
    userId: 'user2',
    username: '小花',
    content: '一個人旅行真的很棒！哲學之道是我最喜歡的地方之一。',
    date: '2025-04-23',
    reported: false,
    approved: null,
  },
  {
    id: 'c8',
    articleId: '15',
    userId: 'user1',
    username: '小明',
    content: '這個部落格真的很爛，什麼都不會！完全是在浪費時間。',
    date: '2025-12-29',
    reported: true,
    reportReason: '留言內容具有攻擊性，對作者不尊重',
    approved: null,
  },
  {
    id: 'c9',
    articleId: '15',
    userId: 'user2',
    username: '小花',
    content: '感謝你的分享！對2026年的技術趨勢很有幫助，特別是AI那段。',
    date: '2025-12-30',
    reported: false,
    approved: null,
  },
];
