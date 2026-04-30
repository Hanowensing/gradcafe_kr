import type { AdmissionResult } from '../types';

export const UNIVERSITIES = [
  // 과학기술원
  'KAIST', 'POSTECH', 'UNIST', 'DGIST', 'GIST',

  // 서울
  '서울대학교', '연세대학교', '고려대학교', '성균관대학교', '한양대학교',
  '이화여자대학교', '서강대학교', '중앙대학교', '경희대학교', '한국외국어대학교',
  '서울시립대학교', '숙명여자대학교', '동국대학교', '건국대학교', '홍익대학교',
  '세종대학교', '광운대학교', '명지대학교', '국민대학교', '덕성여자대학교',
  '상명대학교', '서울여자대학교', '한성대학교', '삼육대학교', '동덕여자대학교',
  '성신여자대학교', '한국항공대학교', 'KC대학교', '장로회신학대학교',
  '감리교신학대학교', '추계예술대학교', '서경대학교', '총신대학교',
  '서울신학대학교', '한국성서대학교', '성공회대학교', '한국방송통신대학교',
  '서울교육대학교', '한국체육대학교', '한국예술종합학교',

  // 인천
  '인천대학교', '인하대학교', '가천대학교', '경인교육대학교',

  // 경기
  '아주대학교', '경기대학교', '단국대학교', '수원대학교', '성결대학교',
  '한신대학교', '협성대학교', '가톨릭대학교', '을지대학교', '차의과학대학교',
  '한세대학교', '대진대학교', '평택대학교', '안양대학교', '강남대학교',
  '용인대학교', '신한대학교', '한양대학교(ERICA)', '루터대학교', '칼빈대학교',
  '수원가톨릭대학교',

  // 강원
  '강원대학교', '한림대학교', '연세대학교(미래캠퍼스)', '강릉원주대학교',
  '춘천교육대학교', '상지대학교', '가톨릭관동대학교', '경동대학교',

  // 충북
  '충북대학교', '청주대학교', '서원대학교', '세명대학교', '극동대학교',
  '건국대학교(글로컬)', '중원대학교', '유원대학교', '꽃동네대학교', '한국교통대학교',

  // 대전·세종·충남
  '충남대학교', '한밭대학교', '공주대학교', '배재대학교', '건양대학교',
  '나사렛대학교', '순천향대학교', '단국대학교(천안)', '한남대학교', '대전대학교',
  '목원대학교', '우송대학교', '침례신학대학교', '호서대학교', '상명대학교(천안)',
  '백석대학교', '남서울대학교', '한국기술교육대학교', '한국전통문화대학교',
  '고려대학교(세종)', '홍익대학교(세종)',

  // 전북
  '전북대학교', '원광대학교', '전주대학교', '군산대학교', '우석대학교',
  '예수대학교', '한일장신대학교', '호원대학교',

  // 광주·전남
  '전남대학교', '조선대학교', '광주대학교', '호남대학교', '남부대학교',
  '동신대학교', '목포대학교', '순천대학교', '목포해양대학교', '초당대학교',
  '세한대학교', '광주여자대학교', '송원대학교', '광주교육대학교',

  // 대구·경북
  '경북대학교', '영남대학교', '계명대학교', '대구대학교', '대구가톨릭대학교',
  '금오공과대학교', '안동대학교', '동국대학교(경주)', '위덕대학교', '경일대학교',
  '대구한의대학교', '한동대학교', '경운대학교', '경주대학교', '대구예술대학교',
  '대구교육대학교',

  // 부산·울산·경남
  '부산대학교', '경상국립대학교', '울산대학교', '창원대학교', '경남대학교',
  '동아대학교', '부경대학교', '한국해양대학교', '경성대학교', '동서대학교',
  '신라대학교', '인제대학교', '경남과학기술대학교', '창신대학교', '고신대학교',
  '동의대학교', '영산대학교', '부산외국어대학교', '부산교육대학교',

  // 제주
  '제주대학교', '제주국제대학교',

  // 특수·사관
  '한국교원대학교', '육군사관학교', '해군사관학교', '공군사관학교',
  '국군간호사관학교', '경찰대학',

  // 미국 — Ivy League
  'Harvard University', 'Yale University', 'Princeton University',
  'Columbia University', 'University of Pennsylvania', 'Brown University',
  'Dartmouth College', 'Cornell University',

  // 미국 — 상위 사립 연구대학
  'MIT', 'Stanford University', 'Caltech', 'University of Chicago',
  'Duke University', 'Northwestern University', 'Vanderbilt University',
  'Rice University', 'Emory University', 'University of Notre Dame',
  'Georgetown University', 'Tufts University', 'Wake Forest University',
  'Carnegie Mellon University', 'Johns Hopkins University',
  'Washington University in St. Louis', 'Case Western Reserve University',
  'Tulane University', 'Brandeis University', 'Boston College',
  'Boston University', 'Northeastern University',
  'Rensselaer Polytechnic Institute', 'Stevens Institute of Technology',
  'New York University', 'Fordham University', 'Syracuse University',
  'Villanova University', 'Lehigh University', 'Drexel University',
  'George Washington University', 'American University', 'Howard University',
  'Worcester Polytechnic Institute', 'Illinois Institute of Technology',
  'Rochester Institute of Technology', 'University of Rochester',
  'Baylor University', 'Southern Methodist University',
  'Pepperdine University', 'Santa Clara University', 'Marquette University',

  // 미국 — UC 계열
  'UC Berkeley', 'UCLA', 'UC San Diego', 'UC Davis',
  'UC Santa Barbara', 'UC Irvine', 'UC Santa Cruz', 'UC Riverside',
  'UC Merced',

  // 미국 — 상위 주립 연구대학
  'University of Michigan', 'University of Illinois Urbana-Champaign',
  'Georgia Tech', 'University of Texas at Austin',
  'University of Wisconsin-Madison', 'Penn State University',
  'Purdue University', 'Ohio State University', 'University of Minnesota',
  'University of Washington', 'University of Maryland',
  'University of Virginia', 'University of North Carolina at Chapel Hill',
  'North Carolina State University', 'Virginia Tech',
  'Arizona State University', 'University of Arizona',
  'University of Colorado Boulder', 'Colorado State University',
  'University of Florida', 'Florida State University',
  'University of Georgia', 'University of Pittsburgh',
  'Rutgers University', 'University of Connecticut',
  'Indiana University', 'Iowa State University',
  'Kansas State University', 'University of Kansas',
  'Michigan State University', 'Texas A&M University',
  'University of Tennessee', 'University of Kentucky',
  'University of Missouri', 'Oregon State University',
  'University of Oregon', 'Washington State University',
  'Stony Brook University', 'University at Buffalo',
  'University of Massachusetts Amherst', 'University of New Hampshire',
  'University of Vermont', 'University of Delaware',
  'University of Rhode Island', 'Auburn University',
  'University of Alabama', 'Mississippi State University',
  'Louisiana State University', 'University of Oklahoma',
  'Oklahoma State University', 'University of Nebraska–Lincoln',
  'University of Iowa', 'University of South Carolina',
  'Clemson University', 'University of Hawaii at Manoa',
  'University of Utah', 'Utah State University',
  'University of Nevada Las Vegas', 'University of Nevada Reno',
  'New Mexico State University', 'University of New Mexico',
  'University of Wyoming', 'South Dakota State University',
  'North Dakota State University', 'Montana State University',
  'University of Idaho', 'University of Montana',
  'University of Alaska Fairbanks',

  // 미국 — 리버럴아츠 칼리지
  'Williams College', 'Amherst College', 'Swarthmore College',
  'Wellesley College', 'Pomona College', 'Claremont McKenna College',
  'Middlebury College', 'Bowdoin College', 'Carleton College',
  'Haverford College', 'Colby College', 'Hamilton College',
  'Smith College', 'Vassar College', 'Colgate University',
  'Wesleyan University', 'Bates College', 'Harvey Mudd College',
  'Davidson College', 'Grinnell College', 'Macalester College',
  'Oberlin College', 'Colorado College', 'Trinity College',
  'College of the Holy Cross', 'Kenyon College', 'Bucknell University',
  'Lafayette College', 'Union College', 'Dickinson College',

  // 미국 — 추가 200 (랭킹 순, 기존 목록 제외)
  // 상위 사립·공립 (1–50)
  'College of William & Mary', 'University of Miami', 'Temple University',
  'University of Denver', 'Loyola Marymount University',
  'Texas Christian University', 'University of Houston', 'Texas Tech University',
  'University of Texas at Dallas', 'George Mason University',
  'New Jersey Institute of Technology', 'Virginia Commonwealth University',
  'University of Mississippi', 'University of Arkansas', 'West Virginia University',
  'Loyola University Chicago', 'Saint Louis University', 'Creighton University',
  'Gonzaga University', 'Seton Hall University',
  'DePaul University', 'University of South Florida', 'University of Central Florida',
  'Florida International University', 'Florida Atlantic University',
  'University of Cincinnati', 'Miami University', 'Ohio University',
  'University of Illinois Chicago', 'University of Wisconsin-Milwaukee',
  'Wayne State University', 'University of Colorado Denver', 'Boise State University',
  'University of North Dakota', 'University of South Dakota',
  'University of North Texas', 'University of Memphis',
  'University of Alabama at Birmingham', 'University of Louisiana at Lafayette',
  'University of Louisville',
  'Old Dominion University', 'James Madison University',
  'Georgia State University', 'Georgia Southern University', 'Kennesaw State University',
  'Duquesne University', 'Hofstra University', 'Clark University',
  'University of Maryland Baltimore County', 'Embry-Riddle Aeronautical University',

  // 사립·전문대 (51–80)
  'Florida Institute of Technology', 'University of San Diego',
  'University of San Francisco', 'University of Portland', 'Xavier University',
  'Loyola University New Orleans', 'University of the Pacific',
  'University of Scranton', 'Saint Joseph\'s University', 'Fairfield University',
  'Quinnipiac University', 'Sacred Heart University', 'University of Hartford',
  'University of New Haven', 'Pace University', 'St. John\'s University',
  'Iona University', 'New School', 'Long Island University',
  'Towson University', 'Morgan State University', 'Salisbury University',
  'La Salle University', 'Mercer University', 'Samford University',
  'Nova Southeastern University', 'Stetson University', 'University of Tampa',
  'University of New England', 'Suffolk University',

  // 오하이오·중서부 주립 (81–100)
  'Kent State University', 'University of Toledo', 'Ball State University',
  'Western Michigan University', 'University of Akron',
  'Bowling Green State University', 'University of Dayton',
  'Missouri University of Science and Technology', 'University of Missouri-Kansas City',
  'University of Missouri-St. Louis', 'Indiana State University',
  'University of Southern Indiana', 'Illinois State University',
  'Northern Illinois University', 'Southern Illinois University Carbondale',
  'Southern Illinois University Edwardsville', 'Central Michigan University',
  'Eastern Michigan University', 'Grand Valley State University',
  'Northern Michigan University',

  // 남동부 주립 (101–130)
  'Louisiana Tech University', 'Arkansas State University',
  'University of Southern Mississippi', 'University of Alabama in Huntsville',
  'University of South Alabama', 'Troy University',
  'University of Tennessee at Chattanooga', 'Tennessee Technological University',
  'Middle Tennessee State University', 'East Tennessee State University',
  'Tennessee State University', 'Western Kentucky University',
  'Eastern Kentucky University', 'Murray State University',
  'Northern Kentucky University', 'East Carolina University',
  'University of North Carolina at Charlotte', 'University of North Carolina at Greensboro',
  'University of North Carolina Wilmington', 'Appalachian State University',
  'Western Carolina University', 'Augusta University',
  'University of West Georgia', 'Georgia College & State University',
  'Jacksonville State University', 'University of Louisiana Monroe',
  'Southeastern Louisiana University', 'University of North Florida',
  'University of West Florida', 'Florida Gulf Coast University',

  // 텍사스 주립 (131–145)
  'Texas State University', 'University of Texas at Arlington',
  'University of Texas at San Antonio', 'University of Texas at El Paso',
  'University of Texas Rio Grande Valley', 'Sam Houston State University',
  'Stephen F. Austin State University', 'Lamar University',
  'Texas A&M University-Corpus Christi', 'Texas A&M International University',
  'West Texas A&M University', 'Angelo State University',
  'University of Houston-Clear Lake', 'Prairie View A&M University',
  'Tarleton State University',

  // 위스콘신·아이오와·평원 주립 (146–160)
  'University of Wisconsin-Eau Claire', 'University of Wisconsin-La Crosse',
  'University of Wisconsin-Oshkosh', 'University of Wisconsin-Green Bay',
  'University of Wisconsin-Stevens Point', 'University of Wisconsin-Whitewater',
  'University of Northern Iowa', 'University of Northern Colorado',
  'University of Colorado Colorado Springs', 'Weber State University',
  'Idaho State University', 'University of Alaska Anchorage',
  'University of Hawaii at Hilo', 'University of Maine',
  'University of Massachusetts Dartmouth',

  // 태평양·서부 (161–175)
  'Seattle University', 'Western Washington University',
  'Eastern Washington University', 'University of Puget Sound',
  'Portland State University', 'San Diego State University',
  'San Jose State University', 'Cal Poly San Luis Obispo', 'Cal Poly Pomona',
  'Cal State Fullerton', 'Cal State Long Beach', 'Cal State Northridge',
  'San Francisco State University', 'California State University Sacramento',
  'Cal State East Bay',

  // 버지니아·중부대서양 (176–185)
  'Radford University', 'Longwood University',
  'Christopher Newport University', 'Norfolk State University',
  'University of Massachusetts Boston', 'University of Massachusetts Lowell',
  'University of New Hampshire Manchester', 'Regis University',
  'Missouri State University', 'University of Central Arkansas',

  // 사우스캐롤라이나·캐롤라이나 (186–193)
  'Winthrop University', 'Coastal Carolina University',
  'Fayetteville State University', 'University of Arkansas at Little Rock',
  'Florida A&M University', 'University of Mississippi Medical Center',
  'Belmont University', 'Lipscomb University',

  // 캘리포니아 주립 추가 (194–200)
  'Cal State Bakersfield', 'Cal State San Bernardino',
  'Cal Poly Humboldt', 'California State University Monterey Bay',
  'Cal State San Marcos', 'Cal State Stanislaus',
  'Cal State Dominguez Hills',
];

export const DEPARTMENTS = [
  // 공학계열
  '컴퓨터공학과', '소프트웨어학과', '인공지능학과', '데이터사이언스학과',
  '정보통신공학과', '전기공학과', '전자공학과', '전기전자공학과',
  '반도체공학과', '제어계측공학과', '통신공학과',
  '기계공학과', '기계설계학과', '로봇공학과', '항공우주공학과', '자동차공학과',
  '화학공학과', '고분자공학과', '에너지화학공학과', '신소재공학과', '재료공학과',
  '토목공학과', '건축공학과', '건축학과', '도시공학과', '환경공학과',
  '산업공학과', '시스템공학과', '안전공학과', '해양공학과',
  '바이오공학과', '생명공학과', '의용공학과', '식품공학과', '농생명공학과',
  // 자연과학계열
  '수학과', '통계학과', '물리학과', '화학과', '생명과학과', '생물학과',
  '지구과학과', '지질학과', '해양학과', '천문학과', '대기과학과',
  // 의학·보건
  '의학과', '치의학과', '약학과', '한의학과', '간호학과', '보건학과',
  '의생명과학과', '임상의학과', '공중보건학과', '재활학과',
  // 사회과학계열
  '경영학과', '경제학과', '행정학과', '정치외교학과', '사회학과',
  '심리학과', '사회복지학과', '언론정보학과', '광고홍보학과', '미디어학과',
  '국제학과', '국제개발협력학과',
  // 인문계열
  '국어국문학과', '영어영문학과', '불어불문학과', '독어독문학과',
  '중어중문학과', '일어일문학과', '러시아학과', '언어학과', '철학과',
  '역사학과', '고고학과', '문화재학과', '문화콘텐츠학과',
  // 예체능·교육
  '교육학과', '유아교육학과', '특수교육학과', '교육공학과',
  '체육학과', '스포츠과학과', '미술학과', '디자인학과', '음악학과',
  // 융합·신설
  '융합전공학부', '자유전공학부', '지속가능학과', '스마트시티학과',
  '뇌공학과', '양자정보학과', '핀테크학과', '빅데이터학과',
];

export const SEASONS: string[] = (() => {
  const list: string[] = [];
  for (let year = 2026; year >= 2021; year--) {
    list.push(`${year}년 가을`);
    list.push(`${year}년 봄`);
  }
  return list;
})();

export const mockResults: AdmissionResult[] = [];
