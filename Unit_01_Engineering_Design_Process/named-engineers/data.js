// Named 23 — Engineer & Scientist Profiles
// 23 engineers and scientists selected by the AER class to name the 3D printers.
//
// Photos: stored locally in named-engineers/photos/ and referenced via the photo field.
//   photo: 'photos/filename.jpg' = use this local file (served from GitHub Pages)
//   photo: null = no photo; show colored initials avatar instead
//   wikiTitle: kept for reference and as fallback; loadWikiPhoto() is still available
//     but most engineers now use local photos for reliability.

const ENGINEERS = [

  // ── PRINTERS OF HONOR ──────────────────────────────────────────────────────

  {
    id: 'chuck-hull',
    name: 'Chuck Hull',
    years: 'b. 1939',
    field: 'Engineering Physics · Additive Manufacturing',
    specialty: '3D Printing Pioneer',
    badgeColor: 'gold',
    wikiTitle: 'Chuck_Hull',
    photo: 'photos/chuck-hull.jpg',
    accomplishments: [
      'Invented stereolithography (SLA) in 1983 — the world\'s first 3D printing technology, which cures liquid photopolymer resin with UV light layer by layer',
      'Founded 3D Systems Corporation in 1986, the world\'s first 3D printing company',
      'Holds over 60 patents in additive manufacturing, photopolymer processes, and related technologies',
      'His invention created an entirely new manufacturing sector now worth more than $20 billion annually — used in aerospace, medicine, automotive, and consumer products'
    ],
    fact: 'The very first object Hull ever 3D printed was a tiny plastic eyewash cup — modest, functional, and the ancestor of every 3D-printed object that followed. Every printer in this room traces its lineage to that cup.',
    source: '3D Systems — Our Story',
    sourceUrl: 'https://www.3dsystems.com/our-story',
    nominatedBy: '2 students'
  },

  {
    id: 'scott-crump',
    name: 'S. Scott Crump',
    years: 'b. 1954',
    field: 'Mechanical Engineering · Fused Deposition Modeling',
    specialty: '3D Printing Pioneer',
    badgeColor: 'gold',
    wikiTitle: null, // no Wikipedia portrait available for him
    photo: 'photos/scott-crump.jpg',
    accomplishments: [
      'Invented Fused Deposition Modeling (FDM) in 1989 — the technology used inside every Bambu printer in this shop',
      'Co-founded Stratasys, Ltd., which became one of the world\'s largest 3D printing companies',
      'FDM works by melting a thermoplastic filament and depositing it layer by layer — exactly what you watched on your first print',
      'His patent portfolio made Stratasys a multi-billion-dollar company; FDM is now the most widely used 3D printing method in the world'
    ],
    fact: 'Crump invented FDM while trying to make his daughter a toy frog. He loaded a hot glue gun with polyethylene and candle wax and experimented until the idea clicked. The first patent was filed while the frog was still drying.',
    source: 'Stratasys — Company History',
    sourceUrl: 'https://www.stratasys.com/en/about-us/history/',
    nominatedBy: '1 student'
  },

  {
    id: 'woodie-flowers',
    name: 'Woodie Flowers',
    years: '1943–2019',
    field: 'Mechanical Engineering · Engineering Education',
    specialty: 'Robotics Connection',
    badgeColor: 'green',
    wikiTitle: 'Woodie_Flowers',
    photo: 'photos/woodie-flowers.jpg',
    accomplishments: [
      'MIT mechanical engineering professor who redefined what hands-on engineering education could look like',
      'Co-founded FIRST Robotics Competition alongside Dean Kamen in 1989 — the competition driving the robot you\'re building this year',
      'Developed MIT\'s 2.007 course, one of the most influential hands-on engineering courses ever taught',
      'National Medal of Technology laureate; inducted into the National Inventors Hall of Fame'
    ],
    fact: 'Flowers coined the phrase "gracious professionalism" — the FIRST core value that says you compete hard while treating everyone, including your opponents, with genuine respect. The phrase is used at every FIRST event in the world and printed on team banners in hundreds of languages.',
    source: 'FIRST Robotics — Woodie Flowers tribute',
    sourceUrl: 'https://www.firstinspires.org/community/woodie-flowers-fund',
    nominatedBy: '1 student'
  },

  // ── FAN FAVORITES ──────────────────────────────────────────────────────────

  {
    id: 'gustave-eiffel',
    name: 'Gustave Eiffel',
    years: '1832–1923',
    field: 'Civil & Structural Engineering',
    specialty: null,
    badgeColor: 'blue',
    nominationCount: 5,
    wikiTitle: 'Gustave_Eiffel',
    photo: 'photos/gustave-eiffel.jpg',
    accomplishments: [
      'Designed and engineered the Eiffel Tower in Paris (1889), at the time the world\'s tallest man-made structure at 330 meters',
      'Designed the internal wrought-iron skeletal framework that holds up the Statue of Liberty — the visible copper skin hangs on Eiffel\'s structure',
      'Pioneered the use of mathematical modeling in structural engineering at a scale previously thought impossible',
      'After retiring from engineering at age 60, converted the Eiffel Tower\'s top floor into a private aerodynamics laboratory and spent 15 years doing serious scientific research'
    ],
    fact: 'After finishing the tower, Eiffel rebuilt its top floor into his own aerodynamics lab — studying air resistance and drag for early aircraft designers. He published respected research papers from the top of the structure he had built to demonstrate it could be done at all.',
    source: 'Société de la Tour Eiffel',
    sourceUrl: 'https://www.toureiffel.paris/en/the-monument/gustave-eiffel',
    nominatedBy: '5 students — most nominated in the class'
  },

  {
    id: 'nikola-tesla',
    name: 'Nikola Tesla',
    years: '1856–1943',
    field: 'Electrical Engineering',
    specialty: null,
    badgeColor: null,
    nominationCount: 3,
    wikiTitle: 'Nikola_Tesla',
    photo: 'photos/nikola-tesla.jpg',
    accomplishments: [
      'Invented the alternating current (AC) induction motor and transformer, making long-distance electrical power transmission practical',
      'Developed the Tesla coil (1891), still used in radio, television, and high-voltage research',
      'Held over 300 patents; his AC power system is the basis for every electrical grid in the world',
      'Pioneered concepts in radio transmission, X-ray technology, and wireless power that were decades ahead of his time'
    ],
    fact: 'Tesla had an intense, lifelong obsession with pigeons. He fed them daily in Bryant Park and once spent $2,000 — well over $30,000 in today\'s money — nursing a single sick pigeon back to health in his hotel room at the New Yorker Hotel.',
    source: 'Tesla Universe — Biography',
    sourceUrl: 'https://teslauniverse.com/nikola-tesla/biography',
    nominatedBy: '3 students'
  },

  {
    id: 'thomas-edison',
    name: 'Thomas Edison',
    years: '1847–1931',
    field: 'Invention & Electrical Engineering',
    specialty: null,
    badgeColor: null,
    nominationCount: 3,
    wikiTitle: 'Thomas_Edison',
    photo: 'photos/thomas-edison.jpg',
    accomplishments: [
      'Developed the first practical incandescent light bulb (1879) and the infrastructure to power it — including the first commercial power station on Pearl Street in Manhattan',
      'Invented the phonograph (1877), the first device that could record and replay sound',
      'Developed the motion picture camera (kinetoscope) and contributed foundational work to early cinema',
      'Established Menlo Park, the world\'s first industrial research laboratory — a model for how modern R&D works'
    ],
    fact: 'Edison held 1,093 patents — a world record that stood for decades. Among the stranger ones: he also invented the electric pen, an early precursor to the tattoo machine. The same rotary mechanism that poked stencils later found its way under human skin.',
    source: 'Thomas Edison National Historical Park (NPS)',
    sourceUrl: 'https://www.nps.gov/edis/index.htm',
    nominatedBy: '3 students'
  },

  // ── STANDARD WINNERS ───────────────────────────────────────────────────────

  {
    id: 'alan-turing',
    name: 'Alan Turing',
    years: '1912–1954',
    field: 'Mathematics & Computer Science',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Alan_Turing',
    photo: 'photos/alan-turing.jpg',
    accomplishments: [
      'Invented the theoretical "Turing machine" in 1936 — a mathematical model that defines what any computer can compute, still the foundation of computer science',
      'Led the team at Bletchley Park that broke the Nazi Enigma cipher during WWII, providing intelligence that historians estimate shortened the war by two years and saved millions of lives',
      'Designed one of the first practical stored-program computer architectures (the ACE) and contributed foundational work to artificial intelligence',
      'Published the paper "Computing Machinery and Intelligence" (1950), which introduced the Turing Test — still a benchmark for AI research today'
    ],
    fact: 'In 1948, Turing wrote the world\'s first chess-playing program — a detailed algorithm he called Turochamp. No computer existed at the time that could run it, so he hand-simulated the program himself, working through each move manually on paper.',
    source: 'Computer History Museum — Alan Turing',
    sourceUrl: 'https://computerhistory.org/profile/alan-turing/',
    nominatedBy: '1 student'
  },

  {
    id: 'isaac-newton',
    name: 'Isaac Newton',
    years: '1643–1727',
    field: 'Mathematics & Physics',
    specialty: null,
    badgeColor: null,
    nominationCount: 2,
    wikiTitle: 'Isaac_Newton',
    photo: 'photos/isaac-newton.jpg',
    accomplishments: [
      'Formulated the universal law of gravitation and the three laws of motion — still the foundation of classical mechanics and engineering physics',
      'Invented calculus independently (simultaneously with Leibniz), a mathematical tool essential to every engineering discipline',
      'Built the first practical reflecting telescope (1668), demonstrating that a mirror could replace a lens for astronomical observation',
      'Made foundational discoveries about the nature of light, showing that white light is composed of all colors of the spectrum'
    ],
    fact: 'Newton was born so prematurely — on Christmas Day 1642 — that his mother said he was so small he could fit inside a quart mug. He was not expected to survive the night. He lived to 84.',
    source: 'Royal Society — Newton',
    sourceUrl: 'https://royalsociety.org/topics-policy/diversity-in-science/scientists-who-changed-the-world/isaac-newton/',
    nominatedBy: '2 students'
  },

  {
    id: 'willis-carrier',
    name: 'Willis Carrier',
    years: '1876–1950',
    field: 'Mechanical Engineering · HVAC',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Willis_Carrier',
    photo: 'photos/willis-carrier.jpg',
    accomplishments: [
      'Invented the first modern electrical air conditioning system in 1902, solving a humidity problem at a Brooklyn printing plant',
      'Founded Carrier Corporation in 1915, which remains one of the world\'s largest HVAC companies',
      'His technology made possible skyscrapers (cooling tall buildings), deep-surface mining, precision manufacturing, and the growth of cities in hot climates',
      'Air conditioning is credited with transforming the economies of the American South, the Middle East, Singapore, and numerous other hot-climate regions'
    ],
    fact: 'Carrier did not invent air conditioning to cool people. He built it in 1902 to keep ink from smearing and paper from crinkling at the Sackett & Wilhelms printing plant in Brooklyn. Temperature control for human comfort was an afterthought — the breakthrough came from protecting a print job.',
    source: 'Carrier Corporation — History',
    sourceUrl: 'https://www.carrier.com/carrier/en/worldwide/about/history/',
    nominatedBy: '1 student · outstanding nomination research'
  },

  {
    id: 'mary-anderson',
    name: 'Mary Anderson',
    years: '1866–1953',
    field: 'American Inventor',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Mary_Anderson_(inventor)',
    photo: 'photos/mary-anderson.jpg',
    accomplishments: [
      'Invented the windshield wiper in 1903, after observing a New York City trolley driver stopping in the rain to manually clear his window',
      'Designed a spring-loaded rubber blade mounted on a swinging arm, controlled by a lever inside the vehicle — the same fundamental design used today',
      'Received U.S. Patent No. 743,801 in 1903; the patent was allowed to expire in 1920 before the auto industry adopted the technology',
      'Her invention is now mandatory on every motor vehicle sold in the world — billions of cars, trucks, and buses use a mechanism she designed'
    ],
    fact: 'Every manufacturer Mary Anderson approached rejected her invention. They claimed the moving blade on the windshield would distract drivers. Her patent expired before anyone paid her a cent for it. Within a decade, windshield wipers were standard equipment on every new car.',
    source: 'National Inventors Hall of Fame — Mary Anderson',
    sourceUrl: 'https://www.invent.org/inductees/mary-anderson',
    nominatedBy: '1 student'
  },

  {
    id: 'charles-babbage',
    name: 'Charles Babbage',
    years: '1791–1871',
    field: 'Mechanical Engineering · Computing',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Charles_Babbage',
    photo: 'photos/charles-babbage.jpg',
    accomplishments: [
      'Designed the Difference Engine (1820s) — a mechanical calculator that could evaluate polynomial equations and print results, eliminating human arithmetic errors',
      'Conceived the Analytical Engine — a general-purpose mechanical computer with a "store" (memory), a "mill" (processor), and punch-card input, conceptually identical to a modern CPU',
      'His collaborator Ada Lovelace wrote what is considered the first computer algorithm for the Analytical Engine — making Babbage\'s machine the first programmable computer in concept',
      'Also invented the speedometer, the cowcatcher for locomotives, and a system for decoding ciphers'
    ],
    fact: 'The full Difference Engine was never completed in Babbage\'s lifetime — the project collapsed in a bitter dispute over payments with his chief machinist, Joseph Clement. A fully functional Difference Engine No. 2 was finally built by the Science Museum in London in 1991 — using only tools and methods available in the 1840s. It worked on the first try.',
    source: 'Computer History Museum — Charles Babbage',
    sourceUrl: 'https://computerhistory.org/profile/charles-babbage/',
    nominatedBy: '1 student'
  },

  {
    id: 'burt-rutan',
    name: 'Burt Rutan',
    years: 'b. 1943',
    field: 'Aerospace Engineering',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Burt_Rutan',
    photo: 'photos/burt-rutan.jpg',
    accomplishments: [
      'Designed the Voyager aircraft, which completed the first nonstop, non-refueled flight around the world in 1986 — piloted by his brother Dick Rutan and Jeana Yeager',
      'Founded Scaled Composites, a pioneering aerospace design firm known for radical, unconventional aircraft geometries',
      'Designed SpaceShipOne, the first privately funded spacecraft to reach space (2004), winning the Ansari X Prize',
      'Over his career, designed more than 40 aircraft, many of which pushed the boundaries of what composite materials could achieve'
    ],
    fact: 'Early in his career, Rutan couldn\'t afford a proper wind tunnel to test aircraft designs. So he mounted a test model to the roof of his 1966 Dodge Dart, drove it down the highway at speed, and measured the aerodynamic forces himself. Several real designs emerged from data collected that way.',
    source: 'Scaled Composites — About Burt Rutan',
    sourceUrl: 'https://www.scaled.com',
    nominatedBy: '1 student · outstanding nomination research'
  },

  {
    id: 'ralph-baer',
    name: 'Ralph Baer',
    years: '1922–2014',
    field: 'Electrical Engineering · Consumer Electronics',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Ralph_H._Baer',
    photo: 'photos/ralph-baer.jpg',
    accomplishments: [
      'Invented "The Brown Box" in 1966 — the first home video game console prototype, which became the Magnavox Odyssey and launched the home gaming industry',
      'Held over 150 patents across military electronics, consumer products, and games',
      'Invented Simon (1978), the iconic electronic memory game that sold 50 million units and is still in production',
      'Received the National Medal of Technology from President George W. Bush in 2006 for his contributions to the entertainment industry'
    ],
    fact: 'In addition to inventing the video game console, Baer also invented a talking doormat that greeted whoever stepped on it. He held patents in an extraordinarily wide range of products and considered the doormat one of his more underappreciated ideas.',
    source: 'National Inventors Hall of Fame — Ralph Baer',
    sourceUrl: 'https://www.invent.org/inductees/ralph-h-baer',
    nominatedBy: '1 student'
  },

  {
    id: 'heinrich-hertz',
    name: 'Heinrich Hertz',
    years: '1857–1894',
    field: 'Physics · Electromagnetism',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Heinrich_Hertz',
    photo: 'photos/heinrich-hertz.jpg',
    accomplishments: [
      'Proved the existence of electromagnetic waves in 1887, conclusively validating James Clerk Maxwell\'s theoretical predictions from 1865',
      'His experimental apparatus — a spark gap transmitter and a loop receiver — was the world\'s first radio transmitter and receiver, though he didn\'t recognize the communication application',
      'His discoveries made possible radio, television, radar, WiFi, Bluetooth, and every other form of wireless communication',
      'The SI unit of frequency — the hertz (Hz) — is named after him; it appears on every speaker, monitor, and processor specification sheet'
    ],
    fact: 'Hertz made his landmark discoveries in a darkened room using entirely homemade equipment — he needed the darkness to see the faint, tiny sparks that proved electromagnetic waves existed. He didn\'t live to see any of the technology his work enabled: he died of a rare autoimmune condition at age 36.',
    source: 'Nobel Prize — Heinrich Hertz (context)',
    sourceUrl: 'https://www.nobelprize.org/prizes/physics/1909/braun/facts/',
    nominatedBy: '1 student'
  },

  {
    id: 'karl-benz',
    name: 'Karl Benz',
    years: '1844–1929',
    field: 'Mechanical Engineering · Automotive',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Karl_Benz',
    photo: 'photos/karl-benz.jpg',
    accomplishments: [
      'Designed and built the Benz Patent-Motorwagen in 1885 — the first true gasoline-powered automobile, powered by a 954 cc single-cylinder engine producing 2/3 horsepower',
      'Received the first automobile patent (DRP 37435) on January 29, 1886 — a date celebrated as the birthday of the automobile',
      'Founded Benz & Cie., which eventually merged with Daimler Motoren Gesellschaft to become Mercedes-Benz',
      'Widely regarded as "the father of the automobile," though the title is sometimes shared with Gottlieb Daimler and Wilhelm Maybach'
    ],
    fact: 'Benz was deeply reluctant to demonstrate the car publicly because of its unreliability. So his wife Bertha secretly loaded their two teenage sons into the Motorwagen one morning in 1888 and drove 106 km from Mannheim to Pforzheim — the world\'s first long-distance automobile road trip — without telling Karl. She stopped at pharmacies along the way to buy fuel (Ligroin, used as a cleaning solvent).',
    source: 'Mercedes-Benz — Heritage',
    sourceUrl: 'https://www.mercedes-benz.com/en/brand/heritage/',
    nominatedBy: '1 student'
  },

  {
    id: 'benjamin-franklin',
    name: 'Benjamin Franklin',
    years: '1706–1790',
    field: 'Natural Philosophy · Invention',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Benjamin_Franklin',
    photo: 'photos/benjamin-franklin.jpg',
    accomplishments: [
      'Proved that lightning is electricity using a kite, a key, and a thunderstorm in 1752 — and immediately invented the lightning rod to protect buildings',
      'Invented bifocal eyeglasses, the Franklin stove, and the flexible urinary catheter — across wildly different fields',
      'Mapped and named the Gulf Stream, transforming transatlantic navigation',
      'One of the Founding Fathers; drafted the Declaration of Independence alongside Jefferson and negotiated the Treaty of Paris that ended the Revolutionary War'
    ],
    fact: 'Franklin believed that sitting naked in front of an open window in cold air was the key to good health and productivity. He called the practice "air bathing" and performed it every morning for decades, even in winter. He described it in detail in letters to friends as a medical recommendation.',
    source: 'Franklin Institute — Benjamin Franklin',
    sourceUrl: 'https://www.fi.edu/benjamin-franklin',
    nominatedBy: '1 student'
  },

  {
    id: 'john-logie-baird',
    name: 'John Logie Baird',
    years: '1888–1946',
    field: 'Electrical Engineering · Television',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'John_Logie_Baird',
    photo: 'photos/john-baird.jpg',
    accomplishments: [
      'Demonstrated the first working television system to 40 members of the Royal Institution in London in January 1926',
      'Transmitted the first transatlantic television signal between London and New York in 1928',
      'Developed the first color television system (1928) and the first electronic color TV broadcast (1944)',
      'Also developed an infrared imaging system ("Noctovision") capable of seeing in total darkness — an early predecessor to thermal imaging'
    ],
    fact: 'Baird\'s earliest working television prototype was built from a bicycle lamp, a tea chest, hatbox lids, darning needles, and salvaged radio components. The system — which transmitted a recognizable image of a human face — sat on his workbench in a rented attic room in Hastings, England. It worked.',
    source: 'Royal Television Society — John Logie Baird',
    sourceUrl: 'https://rts.org.uk/article/john-logie-baird',
    nominatedBy: '1 student'
  },

  {
    id: 'james-watt',
    name: 'James Watt',
    years: '1736–1819',
    field: 'Mechanical Engineering',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'James_Watt',
    photo: 'photos/james-watt.jpg',
    accomplishments: [
      'Dramatically improved the efficiency of the Newcomen steam engine by adding a separate condenser, reducing fuel consumption by roughly 75%',
      'Developed the concept of horsepower as a unit of measurement so customers could compare engine output to the horses his engines replaced',
      'His improvements made steam engines economically viable across industries, triggering the Industrial Revolution',
      'Invented the centrifugal governor — the first feedback control mechanism — which automatically regulated engine speed, a fundamental concept in control systems'
    ],
    fact: 'The watt — the SI unit of power — is named after him. Every time you read watts on a light bulb, a motor nameplate, a charger, or a solar panel, you\'re reading his name. He also coined the term "horsepower" specifically so that farmers shopping for a steam engine could immediately understand the comparison.',
    source: 'Science Museum Group — James Watt',
    sourceUrl: 'https://www.sciencemuseumgroup.org.uk/blog/james-watt-and-the-separate-condenser/',
    nominatedBy: '1 student'
  },

  {
    id: 'luther-haws',
    name: 'Luther Haws',
    years: '1874–1946',
    field: 'Plumbing & Public Health Engineering',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Luther_Haws',
    photo: 'photos/Luther-Haws-unrestored.jpg',
    accomplishments: [
      'Invented the modern drinking fountain in 1906 and filed for U.S. patent in 1909 (Patent No. 1,036,756)',
      'Founded the Haws Drinking Faucet Company in Berkeley, California, which still manufactures drinking fountains and emergency eyewash stations',
      'His design replaced the shared community drinking cup — a significant public health improvement that reduced transmission of diseases like tuberculosis',
      'The drinking fountain became a landmark of American public space: schools, parks, train stations, and government buildings installed thousands of them in the following decades'
    ],
    fact: 'The inspiration came directly from what he saw at his own school: children sharing a single grimy tin cup chained to a faucet to drink water. The cup passed from sick child to healthy child all day long. Haws went home that evening and began designing something better — a fountain that gave every person a clean, individual stream of water.',
    source: 'Berkeley Architectural Heritage Association',
    sourceUrl: 'https://berkeleyheritage.com/',
    nominatedBy: '1 student'
  },

  {
    id: 'j-robert-oppenheimer',
    name: 'J. Robert Oppenheimer',
    years: '1904–1967',
    field: 'Theoretical Physics',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'J._Robert_Oppenheimer',
    photo: 'photos/oppenheimer.jpg',
    accomplishments: [
      'Led the Manhattan Project at Los Alamos, New Mexico as scientific director — the secret program that developed the world\'s first nuclear weapons during WWII',
      'Made foundational contributions to quantum mechanics, including the Born–Oppenheimer approximation, still used in computational chemistry',
      'After the war, became one of the most vocal public advocates for international nuclear arms control and civilian oversight of atomic energy',
      'Directed the Institute for Advanced Study in Princeton, hosting Einstein, Gödel, and many of the greatest scientists of the 20th century'
    ],
    fact: 'Oppenheimer was a recognized child prodigy. He taught himself Latin at age 10 to read classical texts in the original. At age nine, he reportedly told a cousin: "Ask me a question in Latin and I\'ll answer you in Greek." He entered Harvard at 18 and completed his undergraduate degree in three years.',
    source: 'Atomic Heritage Foundation — Oppenheimer',
    sourceUrl: 'https://ahf.nuclearmuseum.org/ahf/profile/j-robert-oppenheimer/',
    nominatedBy: '1 student'
  },

  {
    id: 'john-harington',
    name: 'Sir John Harington',
    years: '1560–1612',
    field: 'Technical Design · Elizabethan England',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'John_Harington_(writer)',
    photo: 'photos/john-harington.jpg',
    accomplishments: [
      'Designed the first flush toilet — which he called "the Ajax" — in 1596, and described its construction in precise detail in a book called "A New Discourse of a Stale Subject: The Metamorphosis of Ajax"',
      'Installed a working Ajax flush toilet at Richmond Palace for Queen Elizabeth I, his godmother',
      'His design included a flush valve, a cistern, and a water seal to contain odors — the essential elements still used in modern toilets over 400 years later',
      'A poet, courtier, and wit at Elizabeth\'s court — the Ajax was as much a satirical social commentary as an engineering project'
    ],
    fact: 'Queen Elizabeth I reportedly liked the invention enough to have one installed in her palace. But she was also said to refuse to use it because she found the sound of flushing undignified and embarrassing. The toilet sat in the palace while the Queen continued to prefer her close-stool in an adjacent room.',
    source: 'Victoria and Albert Museum — History of the toilet',
    sourceUrl: 'https://www.vam.ac.uk/',
    nominatedBy: '1 student'
  },

  {
    id: 'bernhard-heine',
    name: 'Bernhard Heine',
    years: '1800–1846',
    field: 'Medical Engineering & Surgery',
    specialty: null,
    badgeColor: null,
    wikiTitle: null, // no Wikipedia article with photo
    photo: 'photos/Bernhard_Heine.jpg',
    accomplishments: [
      'Invented the osteotome in 1830 — a mechanical chain saw designed specifically for cutting through bone during surgical procedures',
      'His device used a chain of serrated links driven by a hand crank — the same mechanical principle as a modern chainsaw',
      'The osteotome allowed surgeons to cut through bone cleanly and quickly in a way that previously required hammers and chisels, reducing surgical time and patient trauma',
      'Made foundational contributions to understanding bone healing and fracture repair that influenced orthopedic surgery for decades'
    ],
    fact: 'The chainsaw was invented as a surgical tool — not a lumberjack\'s tool. Heine\'s osteotome was designed to cut bone in operating theaters. The timber industry adapted the chain-and-tooth mechanism decades later for cutting wood. Next time someone says "that\'s as crazy as using a chainsaw for surgery" — it was literally designed for surgery first.',
    source: 'History of Surgery — Surgical Innovations',
    sourceUrl: 'https://en.wikipedia.org/wiki/Osteotome',
    nominatedBy: '1 student · most unexpected nominee'
  },

  {
    id: 'elisha-otis',
    name: 'Elisha Graves Otis',
    years: '1811–1861',
    field: 'Mechanical Engineering · Vertical Transport',
    specialty: null,
    badgeColor: null,
    wikiTitle: 'Elisha_Otis',
    photo: 'photos/elisha-otis.jpg',
    accomplishments: [
      'Invented the safety elevator in 1852 — equipped with an automatic brake that would catch the car if the hoisting cable broke, for the first time making passenger elevator travel truly safe',
      'Demonstrated his invention dramatically at the New York Crystal Palace Exhibition in 1854 by having his assistant cut the cable while he was riding the platform',
      'Founded Otis Elevator Company, which remains the world\'s largest elevator manufacturer',
      'His invention made skyscrapers economically viable — without a safe elevator, buildings above 5 stories were impractical for offices and apartments; his brake enabled cities to grow vertically'
    ],
    fact: 'To prove his elevator was safe, Otis staged a public demonstration at the Crystal Palace Exhibition in New York in 1854. He rode the platform up to full height in front of a crowd, then signaled his assistant to cut the hoisting rope with an axe. The safety brake caught the car instantly. The crowd erupted. Within years, buildings across America began going up — literally.',
    source: 'Otis Elevator Company — History',
    sourceUrl: 'https://www.otis.com/en/us/our-company/history',
    nominatedBy: '1 student'
  }

];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getEngineer(id) {
  return ENGINEERS.find(e => e.id === id) || null;
}

function getAdjacentEngineers(id) {
  const idx = ENGINEERS.findIndex(e => e.id === id);
  return {
    prev:  idx > 0                    ? ENGINEERS[idx - 1] : null,
    next:  idx < ENGINEERS.length - 1 ? ENGINEERS[idx + 1] : null,
    index: idx,
    total: ENGINEERS.length
  };
}

// Fetch a Wikipedia thumbnail and set it on imgEl.
// Uses the Wikipedia REST summary API — CORS-safe, no key needed.
// Requests a larger thumbnail (600px) so portrait photos have more pixels to
// crop from and faces aren't lost at card height. Only applies the resize to
// standard Wikimedia Commons thumbnail URLs (safe pattern); others used as-is.
// Falls back silently on any error — initials remain visible.
async function loadWikiPhoto(wikiTitle, imgEl) {
  if (!wikiTitle || !imgEl) return;
  try {
    const resp = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`
    );
    if (!resp.ok) return;
    const data = await resp.json();
    let src = data.thumbnail?.source;
    if (!src) return;
    // Upscale standard Wikimedia thumbnails to 600px wide for better crop quality.
    // Pattern: .../thumb/.../NNNpx-filename — safe to bump; SVG renders and unusual
    // paths don't match so they pass through unchanged.
    if (/\/thumb\/.+\/\d+px-[^/]+$/.test(src)) {
      src = src.replace(/\/\d+px-/, '/600px-');
    }
    imgEl.onerror = () => { imgEl.style.opacity = '0'; }; // broken image → hide
    imgEl.src = src;
    imgEl.style.opacity = '1';
  } catch (e) {
    // Network error or no photo — keep initials, no console noise
  }
}
