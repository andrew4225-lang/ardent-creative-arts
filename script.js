// ARDENT interactive experience. All controls fail gracefully if an optional section is absent.
const ardentTour = [
  ['Music & recording','Rehearsal, recording, production and podcasting.','https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1500&q=85','Illustrative recording studio'],
  ['Film & soundstage','Soundstage, green screen, photography and production.','https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1500&q=85','Illustrative film production space'],
  ['Live performance','A proposed venue and concert hall for artists and audiences.','https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1500&q=85','Illustrative live performance'],
  ['Dance & movement','Studios for classes, rehearsals and choreography.','https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1500&q=85','Illustrative dance studio'],
  ['Visual arts & gallery','Artist workspaces and exhibition experiences.','https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1500&q=85','Illustrative visual arts gallery'],
  ['Creative community','A shared place for learning, enterprise and connection.','https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1500&q=85','Illustrative creative workspace']
];
let tourAt = 0;
function ardentShowTour(n) {
  tourAt = (n + ardentTour.length) % ardentTour.length;
  const item = ardentTour[tourAt];
  const image = document.getElementById('tourImage');
  const title = document.getElementById('tourTitle');
  const copy = document.getElementById('tourCopy');
  const count = document.getElementById('tourCount');
  if (image) { image.src = item[2]; image.alt = item[3]; }
  if (title) title.textContent = item[0];
  if (copy) copy.textContent = item[1];
  if (count) count.textContent = String(tourAt + 1).padStart(2,'0') + ' / 06';
  document.querySelectorAll('.tour-dot').forEach((dot,i) => {
    const active = i === tourAt;
    dot.classList.toggle('active',active);
    dot.setAttribute('aria-pressed',String(active));
  });
}
const dots = document.getElementById('tourDots');
if (dots) {
  ardentTour.forEach((item,i) => {
    const dot = document.createElement('button');
    dot.type = 'button'; dot.className = 'tour-dot' + (!i ? ' active' : '');
    dot.setAttribute('aria-label','View ' + item[0]);
    dot.setAttribute('aria-pressed',String(i===0));
    dot.addEventListener('click',() => ardentShowTour(i));
    dots.appendChild(dot);
  });
  document.getElementById('tourPrev')?.addEventListener('click',() => ardentShowTour(tourAt-1));
  document.getElementById('tourNext')?.addEventListener('click',() => ardentShowTour(tourAt+1));
}

const zoneInfo = {
  music:['ZONE 01 / MUSIC & AUDIO','The sound of possibility.','Rehearsal rooms, recording and production suites, podcast facilities and equipment support.'],
  media:['ZONE 02 / FILM & MEDIA','Stories take shape here.','A soundstage, green screen, photography and video production environments.'],
  arts:['ZONE 03 / VISUAL ARTS','Make ideas visible.','Artist studios, gallery exhibitions, workshops and creative retail concepts.'],
  education:['ZONE 04 / EDUCATION','Talent starts with access.','Rock School, master classes, after-school, accessible arts and online learning.'],
  performance:['ZONE 05 / LIVE PERFORMANCE','Bring people together.','Dance studios, live music venue, concert hall, showcases and audience experiences.'],
  business:['ZONE 06 / CREATIVE BUSINESS','Build the creative economy.','Business support offices, coworking and independently operated creative tenants.'],
  community:['ZONE 07 / COMMUNITY','A place to connect.','Gallery experiences, gathering areas, food and beverage concepts, radio and community events.']
};
document.querySelectorAll('.plan-zone').forEach(button => button.addEventListener('click',() => {
  const info = zoneInfo[button.dataset.zone];
  if (!info) return;
  document.querySelectorAll('.plan-zone').forEach(item => {
    const active = item === button;
    item.classList.toggle('active',active);
    item.setAttribute('aria-pressed',String(active));
  });
  const eyebrow=document.getElementById('planEyebrow');
  const title=document.getElementById('planTitle');
  const copy=document.getElementById('planCopy');
  if(eyebrow) eyebrow.textContent=info[0];
  if(title) title.textContent=info[1];
  if(copy) copy.textContent=info[2];
}));

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() {
  nav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded','false');
}
menuButton?.addEventListener('click',() => {
  const open = nav?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event => { if(event.key==='Escape') closeMenu(); });
const year=document.getElementById('year');
if(year) year.textContent=new Date().getFullYear();

const ARDENT_SUPABASE_URL='https://rpzmjiiomgjttjjrkkqf.supabase.co';
const ARDENT_SUPABASE_KEY='sb_publishable_Lwcv2EAfLV4gAn51_JtlVA_iEEimZIi';
const interestForm=document.getElementById('interestForm');
if(interestForm) interestForm.addEventListener('submit',async event => {
  event.preventDefault();
  const form=event.currentTarget;
  const button=form.querySelector('button[type="submit"]');
  const note=document.getElementById('formNote');
  const originalLabel=button?.textContent || 'Send inquiry';
  const data=new FormData(form);
  const name=String(data.get('name')||'').trim();
  const email=String(data.get('email')||'').trim();
  const interest=String(data.get('interest')||'').trim();
  const message=String(data.get('message')||'').trim();
  if(!name || !email || !interest) {
    if(note) note.textContent='Please complete your name, email address and area of interest.';
    return;
  }
  if(button){button.disabled=true;button.textContent='Sending…';}
  if(note) note.textContent='Submitting your inquiry securely…';
  try {
    if(!window.supabase?.createClient) throw new Error('The inquiry service is temporarily unavailable.');
    const client=window.supabase.createClient(ARDENT_SUPABASE_URL,ARDENT_SUPABASE_KEY);
    const {error}=await client.from('ardent_inquiries').insert({
      full_name:name,email,interest,message
    });
    if(error) throw error;
    form.reset();
    if(note) note.textContent='Thank you. Your inquiry has been received. This is an expression of interest; ARDENT services and bookings are not yet open.';
    if(button){button.textContent='Send another inquiry';button.disabled=false;}
  } catch(error) {
    console.error('ARDENT inquiry submission failed:',error);
    if(note) note.textContent='We could not submit your inquiry right now. Please check your connection and try again.';
    if(button){button.disabled=false;button.textContent=originalLabel;}
  }
});

const explorerContent = {
  music:{eyebrow:'01 / MUSIC & AUDIO',title:'Find your sound.',copy:'Rehearsal rooms, recording suites, production spaces and podcast facilities are envisioned as the creative engine of ARDENT.',image:'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1100&q=85',alt:'Professional recording studio concept'},
  film:{eyebrow:'02 / FILM & MEDIA',title:'Bring the vision to life.',copy:'A soundstage, green screen, photography and video production environments for creators, crews and storytellers.',image:'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1100&q=85',alt:'Film and media production concept'},
  live:{eyebrow:'03 / LIVE & PERFORMANCE',title:'Make it unforgettable.',copy:'Dance studios, a live music venue and a concert and performance hall designed to bring artists and audiences together.',image:'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1100&q=85',alt:'Live performance venue concept'},
  arts:{eyebrow:'04 / VISUAL ARTS',title:'Give ideas a place to live.',copy:'Artist workspaces, exhibitions and a gallery that invite discovery, creative exchange and new perspectives.',image:'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1100&q=85',alt:'Visual arts gallery concept'}
};
document.querySelectorAll('.explorer-tab').forEach(tab => tab.addEventListener('click',() => {
  const item=explorerContent[tab.dataset.space];
  if(!item) return;
  document.querySelectorAll('.explorer-tab').forEach(other => {
    const active=other===tab;
    other.classList.toggle('active',active);
    other.setAttribute('aria-selected',String(active));
  });
  const panel=document.getElementById('spaceExplorerPanel');
  if(!panel) return;
  panel.classList.add('changing');
  const eyebrow=panel.querySelector('.eyebrow'),title=panel.querySelector('h3'),copy=panel.querySelector('p'),image=panel.querySelector('img');
  if(eyebrow) eyebrow.textContent=item.eyebrow;
  if(title) title.textContent=item.title;
  if(copy) copy.textContent=item.copy;
  if(image){image.src=item.image;image.alt=item.alt;}
  window.setTimeout(() => panel.classList.remove('changing'),180);
}));

// Selecting a pathway preselects the matching inquiry category.
document.querySelectorAll('.pathway-card').forEach(card => card.addEventListener('click',() => {
  const select=document.querySelector('#interestForm select[name="interest"]');
  const desired=card.dataset.interest;
  if(select && [...select.options].some(option=>option.value===desired)) select.value=desired;
  document.querySelector('#connect')?.scrollIntoView({behavior:'smooth'});
}));
