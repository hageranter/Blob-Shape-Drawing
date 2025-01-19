function drawShape() {
  const input = document.getElementById('shapeInput').value;
  const dimension = document.getElementById('dimensionSelect').value;
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const threeCanvas = document.getElementById('threeCanvas');

  context.clearRect(0, 0, canvas.width, canvas.height);
  threeCanvas.innerHTML = ''; 

  if (dimension === '2D') {
    threeCanvas.style.display = 'none';
    canvas.style.display = 'block';

    if (input.includes(';')) {
      const points = input.split(';').map(pair => {
        let [x, y] = pair.split(',').map(Number);
        x += (Math.random() - 0.5) * 20;
        y += (Math.random() - 0.5) * 20;
        return { x, y };
      });

      if (points.length > 1) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2;
          context.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }

        context.quadraticCurveTo(points[points.length - 1].x, points[points.length - 1].y, points[0].x, points[0].y);
        context.closePath();
        context.fillStyle = 'rgba(0, 150, 255, 0.3)';
        context.fill();
        context.stroke();
      }
    } else {
      switch (input.toLowerCase()) {
        case 'circle':
          context.beginPath();
          const radius = 50 + (Math.random() - 0.5) * 20; 
          context.arc(250, 250, radius, 0, 2 * Math.PI);
          context.fillStyle = 'rgba(0, 150, 255, 0.3)';
          context.fill();
          context.stroke();
          break;
        case 'square':
          context.beginPath();
          context.moveTo(200 + (Math.random() - 0.5) * 20, 200 + (Math.random() - 0.5) * 20);
          context.lineTo(300 + (Math.random() - 0.5) * 20, 200 + (Math.random() - 0.5) * 20);
          context.lineTo(300 + (Math.random() - 0.5) * 20, 300 + (Math.random() - 0.5) * 20);
          context.lineTo(200 + (Math.random() - 0.5) * 20, 300 + (Math.random() - 0.5) * 20);
          context.closePath();
          context.fillStyle = 'rgba(0, 150, 255, 0.3)';
          context.fill();
          context.stroke();
          break;
        default:
          alert('Unknown 2D shape');
      }
    }
  } else if (dimension === '3D') {
    canvas.style.display = 'none';
    threeCanvas.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 500);
    threeCanvas.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    let shape;
    if (input.includes(';')) {

      const points = input.split(';').map(pair => {
        const [x, y] = pair.split(',').map(Number);
        const z = (Math.random() - 0.5) * 100; 
        return new THREE.Vector3(x, y, z);
      });

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.MeshNormalMaterial({ opacity: 0.8, transparent: true });
      shape = new THREE.Points(geometry, material);
    } else {

      switch (input.toLowerCase()) {
        case 'cube':
          const geometry = new THREE.BoxGeometry(50, 50, 50);
          geometry.verticesNeedUpdate = true;
          geometry.vertices.forEach(vertex => {
            vertex.x += (Math.random() - 0.5) * 20; 
            vertex.y += (Math.random() - 0.5) * 20;
            vertex.z += (Math.random() - 0.5) * 20;
          });
          const material = new THREE.MeshNormalMaterial({ wireframe: false });
          shape = new THREE.Mesh(geometry, material);
          break;
        case 'sphere':
          const sphereGeometry = new THREE.SphereGeometry(25, 32, 32);
          sphereGeometry.verticesNeedUpdate = true;
          sphereGeometry.vertices.forEach(vertex => {
            vertex.x += (Math.random() - 0.5) * 20; 
            vertex.y += (Math.random() - 0.5) * 20;
            vertex.z += (Math.random() - 0.5) * 20;
          });
          const sphereMaterial = new THREE.MeshNormalMaterial({ wireframe: false });
          shape = new THREE.Mesh(sphereGeometry, sphereMaterial);
          break;
        default:
          alert('Unknown 3D shape');
          return;
      }
    }

    scene.add(shape);
    camera.position.z = 200;

    // Animation part
    function animate() {
      requestAnimationFrame(animate);
      shape.rotation.x += 0.01;
      shape.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  }
}
