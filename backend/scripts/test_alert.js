const http = require('http');

function post(url, data) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const options = {
            hostname: u.hostname,
            port: u.port,
            path: u.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data))
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${body}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(JSON.stringify(data));
        req.end();
    });
}

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${body}`));
                }
            });
        }).on('error', (e) => reject(e));
    });
}

async function triggerAlert() {
    try {
        console.log('Fetching drones from http://localhost:5000/api/drones ...');
        const drones = await get('http://localhost:5000/api/drones');
        console.log('Response received:', JSON.stringify(drones, null, 2));

        let droneId = '65d1a123a123a123a123a123'; // Logic fallback
        let droneName = 'Drone de Test';

        if (Array.isArray(drones) && drones.length > 0) {
            droneId = drones[0]._id;
            droneName = drones[0].nom;
        } else {
            console.warn('No real drones found, using fallback ID');
        }

        console.log(`Triggering alert for drone: ${droneName} (${droneId})`);
        const alertData = {
            drone_id: droneId,
            position: {
                lat: 36.8123,
                lng: 10.3456
            },
            image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000',
            confiance: 0.95
        };

        const result = await post('http://localhost:5000/api/missions/alertes', alertData);
        console.log('✅ Success! Result:', JSON.stringify(result, null, 2));
        console.log('\nCheck your Web Dashboard and Mobile App!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

triggerAlert();
