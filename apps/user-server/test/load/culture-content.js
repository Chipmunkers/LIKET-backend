import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '5s',
};

export default function () {
  let res = http.get(
    'http://localhost:3000/culture-content/all?accept=true&region=12',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ); // Update with your API endpoint
  if (res.status !== 200) {
    console.log(res);
  }
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
