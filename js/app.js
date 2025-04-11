const models = [
    {
        id: 1,
        title: "Body",
        description: "A little body I made a while back.",
        date: "2023-09-07",
        category: "characters",
        polygons: "-",
        path: "models/body.fbx",
        format: "fbx"
    },
    {
        id: 2,
        title: "Cape",
        description: "It's just a cape.",
        date: "2023-05-20",
        category: "props",
        polygons: "-",
        path: "models/cape.fbx",
        format: "fbx"
    },
    {
        id: 3,
        title: "Clank",
        description: "Clank, from ratchet and clank.",
        date: "2024-01-08",
        category: "characters",
        polygons: "-",
        path: "models/clank.fbx",
        format: "fbx"
    },
    {
        id: 4,
        title: "Coin",
        description: "A Mario-like coin with my character on it.",
        date: "2023-02-22",
        category: "props",
        polygons: "-",
        path: "models/coin.fbx",
        format: "fbx"
    },
    {
        id: 5,
        title: "Ender3V2Hook",
        description: "A hook I made to hold the camera on my Ender 3 v2.",
        date: "2025-03-25",
        category: "-",
        polygons: "-",
        path: "models/ender3v2hook.fbx",
        format: "fbx"
    },
    {
        id: 6,
        title: "Gameboy",
        description: "A gameboy replica.",
        date: "2023-03-05",
        category: "props",
        polygons: "-",
        path: "models/gameboy.fbx",
        format: "fbx"
    },
    {
        id: 7,
        title: "Huevo",
        description: "A fancy egg",
        date: "2023-05-20",
        category: "characters",
        polygons: "-",
        path: "models/huevo.fbx",
        format: "fbx"
    },
    {
        id: 8,
        title: "Knight",
        description: "Hollow knight's main character",
        date: "2023-09-07",
        category: "characters",
        polygons: "-",
        path: "models/knight.fbx",
        format: "fbx"
    },
    {
        id: 9,
        title: "LPSix",
        description: "Low poly six from little nightmates",
        date: "2023-04-15",
        category: "characters",
        polygons: "-",
        path: "models/lpgirl.fbx",
        format: "fbx"
    },
    {
        id: 10,
        title: "Mario Pipe",
        description: "A pipe from mario",
        date: "2023-02-22",
        category: "props",
        polygons: "-",
        path: "models/mariopipe.fbx",
        format: "fbx"
    },
    {
        id: 11,
        title: "Mermaid Pendant",
        description: "A mermaid pendant from stardew valley for 3d printing",
        date: "2024-04-17",
        category: "props",
        polygons: "-",
        path: "models/mermaidpendant.fbx",
        format: "fbx"
    },
    {
        id: 12,
        title: "Pepsi Can",
        description: "Just a pepsi can.",
        date: "2023-04-17",
        category: "props",
        polygons: "-",
        path: "models/pepsican.fbx",
        format: "fbx"
    },
    {
        id: 13,
        title: "PepsiMan",
        description: "When the world needs hydration, salvation comes in a can!",
        date: "2023-04-17",
        category: "characters",
        polygons: "-",
        path: "models/pepsiman.fbx",
        format: "fbx"
    },
    {
        id: 13,
        title: "Pokéballs",
        description: "Just a bunch of different pokéballs",
        date: "2023-02-27",
        category: "props",
        polygons: "-",
        path: "models/pokeball.fbx",
        format: "fbx"
    },
    {
        id: 14,
        title: "Robot",
        description: "A robot I designed for a game I never made.",
        date: "2024-01-10",
        category: "characters",
        polygons: "-",
        path: "models/robot.fbx",
        format: "fbx"
    },
    {
        id: 15,
        title: "Super Salchicha",
        description: "A character for a 3d platformer, never finished it.",
        date: "2023-05-20",
        category: "characters",
        polygons: "-",
        path: "models/salchicha.fbx",
        format: "fbx"
    },
    {
        id: 16,
        title: "Sirius",
        description: "A character a friend made, I just did a 3d model of it.",
        date: "2023-04-15",
        category: "characters",
        polygons: "-",
        path: "models/sirius.fbx",
        format: "fbx"
    },
    {
        id: 17,
        title: "Snes Controller",
        description: "Just a snes controller",
        date: "2023-01-03",
        category: "props",
        polygons: "-",
        path: "models/snescontroller.fbx",
        format: "fbx"
    }
];

// DOM Elements
const modelList = document.getElementById('model-list');
const modelViewer = document.getElementById('model-viewer');
const modelTitle = document.getElementById('model-title');
const modelDescription = document.getElementById('model-description');
const modelDate = document.getElementById('model-date');
const modelCategory = document.getElementById('model-category');
const modelPolygons = document.getElementById('model-polygons');
const modelFormat = document.getElementById('model-format');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');

// Three.js variables
let scene, camera, renderer, controls, currentModel;

// Global variables for view modes
let currentViewMode = 'normal';
let originalMaterials = new Map();

// Set view mode for the model
function setViewMode(mode) {
    if (!currentModel) return;
    
    // Update UI
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.view-btn[data-view="${mode}"]`).classList.add('active');
    
    currentViewMode = mode;
    
    // Apply the selected view mode
    currentModel.traverse(function(child) {
        if (child.isMesh) {
            // Store original materials if not already stored
            if (!originalMaterials.has(child.uuid)) {
                // Handle both single materials and arrays of materials
                if (Array.isArray(child.material)) {
                    // For material arrays, clone each material in the array
                    const materialArray = [];
                    child.material.forEach(mat => {
                        if (mat) materialArray.push(mat.clone());
                    });
                    originalMaterials.set(child.uuid, materialArray);
                } else if (child.material) {
                    // For single materials, just clone it
                    originalMaterials.set(child.uuid, child.material.clone());
                }
            }
            
            // Get the original material
            const originalMaterial = originalMaterials.get(child.uuid);
            
            switch(mode) {
                case 'normal':
                    // Restore original material
                    if (Array.isArray(originalMaterial)) {
                        // If original was an array, create a new array of clones
                        child.material = originalMaterial.map(mat => mat.clone());
                    } else if (originalMaterial) {
                        // If original was a single material, clone it
                        child.material = originalMaterial.clone();
                    }
                    break;
                    
                case 'wireframe':
                    // Create wireframe material
                    const wireMaterial = new THREE.MeshBasicMaterial({
                        color: 0x4f46e5,
                        wireframe: true
                    });
                    
                    // Apply to all mesh parts (handle material arrays)
                    if (Array.isArray(child.material)) {
                        child.material = Array(child.material.length).fill(wireMaterial);
                    } else {
                        child.material = wireMaterial;
                    }
                    break;
                    
                case 'flat':
                    // Create flat material (no textures, just base color)
                    const flatMaterial = new THREE.MeshBasicMaterial({
                        color: 0xcccccc,
                        flatShading: true
                    });
                    
                    // Apply to all mesh parts
                    if (Array.isArray(child.material)) {
                        child.material = Array(child.material.length).fill(flatMaterial);
                    } else {
                        child.material = flatMaterial;
                    }
                    break;
                    
                case 'normals':
                    // Show normals visualization
                    const normalMaterial = new THREE.MeshNormalMaterial({
                        flatShading: true
                    });
                    
                    // Apply to all mesh parts
                    if (Array.isArray(child.material)) {
                        child.material = Array(child.material.length).fill(normalMaterial);
                    } else {
                        child.material = normalMaterial;
                    }
                    break;
                    
                case 'xray':
                    // X-ray effect
                    const xrayMaterial = new THREE.MeshBasicMaterial({
                        color: 0x4f46e5,
                        transparent: true,
                        opacity: 0.3,
                        side: THREE.DoubleSide
                    });
                    
                    // Apply to all mesh parts
                    if (Array.isArray(child.material)) {
                        child.material = Array(child.material.length).fill(xrayMaterial);
                    } else {
                        child.material = xrayMaterial;
                    }
                    break;
            }
        }
    });
}

// Initialize view mode controls
function initViewControls() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewMode = this.dataset.view;
            setViewMode(viewMode);
        });
    });
}

// Create loading indicator
function createLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    
    const loadingText = document.createElement('p');
    loadingText.id = 'loading-text';
    loadingText.textContent = 'Loading model...';
    
    loadingDiv.appendChild(spinner);
    loadingDiv.appendChild(loadingText);
    
    return loadingDiv;
}

// Initialize the 3D viewer
function initViewer() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Darker background

    // Create camera
    camera = new THREE.PerspectiveCamera(75, modelViewer.clientWidth / modelViewer.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(modelViewer.clientWidth, modelViewer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    modelViewer.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Add a subtle rim light for better edge definition
    const rimLight = new THREE.DirectionalLight(0x4f46e5, 0.3); // Accent color light
    rimLight.position.set(-1, 0, -1);
    scene.add(rimLight);

    // Create a circular platform/base instead of a grid
    const platformGeometry = new THREE.CylinderGeometry(2, 2, 0.05, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        roughness: 0.7,
        metalness: 0.2
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -0.025; // Just below the origin
    platform.receiveShadow = true;
    scene.add(platform);
    
    // Add subtle concentric circles on the platform for better spatial reference
    const circleGeometry = new THREE.RingGeometry(0.5, 0.52, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4f46e5, 
        transparent: true, 
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.rotation.x = Math.PI / 2;
    circle.position.y = 0.001; // Just above the platform
    scene.add(circle);
    
    const outerCircleGeometry = new THREE.RingGeometry(1.5, 1.52, 32);
    const outerCircle = new THREE.Mesh(outerCircleGeometry, circleMaterial);
    outerCircle.rotation.x = Math.PI / 2;
    outerCircle.position.y = 0.001;
    scene.add(outerCircle);
    
    // Add subtle X and Z axis lines for orientation
    const axisLength = 2;
    const axisWidth = 0.01;
    
    // X-axis (red)
    const xAxisGeometry = new THREE.BoxGeometry(axisLength, axisWidth, axisWidth);
    const xAxisMaterial = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.6 });
    const xAxis = new THREE.Mesh(xAxisGeometry, xAxisMaterial);
    xAxis.position.set(axisLength/2, 0.01, 0);
    scene.add(xAxis);
    
    // Z-axis (blue)
    const zAxisGeometry = new THREE.BoxGeometry(axisWidth, axisWidth, axisLength);
    const zAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.6 });
    const zAxis = new THREE.Mesh(zAxisGeometry, zAxisMaterial);
    zAxis.position.set(0, 0.01, axisLength/2);
    scene.add(zAxis);

    // Add OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 2;
    controls.maxDistance = 20;

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = modelViewer.clientWidth / modelViewer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelViewer.clientWidth, modelViewer.clientHeight);
}

// Load a 3D model
function loadModel(modelPath, format) {
    // Remove previous model if exists
    if (currentModel) {
        scene.remove(currentModel);
    }
    
    // Remove any existing loading indicator
    const existingIndicator = modelViewer.querySelector('.loading-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Add loading indicator
    const loadingIndicator = createLoadingIndicator();
    modelViewer.appendChild(loadingIndicator);
    
    // Update loading text
    const loadingText = document.getElementById('loading-text');
    
    let loader;
    
    // Select the appropriate loader based on file format
    switch(format.toLowerCase()) {
        case 'fbx':
            loader = new THREE.FBXLoader();
            break;
        case 'glb':
        case 'gltf':
            loader = new THREE.GLTFLoader();
            break;
        default:
            console.error('Unsupported file format:', format);
            if (loadingIndicator) loadingIndicator.remove();
            showErrorMessage(`Unsupported file format: ${format}`);
            return;
    }
    
    // Load the model
    loader.load(
        modelPath,
        function (object) {
            // For GLB/GLTF models, the object is different than for FBX
            if (format.toLowerCase() === 'glb' || format.toLowerCase() === 'gltf') {
                currentModel = object.scene;
            } else {
                currentModel = object;
                
                // FBX models often need scaling adjustment
                currentModel.scale.set(0.01, 0.01, 0.01);
            }
            
            // Count total polygons (triangles) in the model
            let totalPolygons = 0;
            
            currentModel.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Improve material quality if possible
                    if (child.material) {
                        child.material.side = THREE.DoubleSide;
                    }
                    
                    // Count triangles in the geometry
                    if (child.geometry) {
                        // For BufferGeometry
                        if (child.geometry.isBufferGeometry) {
                            if (child.geometry.index !== null) {
                                totalPolygons += child.geometry.index.count / 3;
                            } else if (child.geometry.attributes.position) {
                                totalPolygons += child.geometry.attributes.position.count / 3;
                            }
                        } 
                        // For legacy Geometry (less common in newer Three.js)
                        else if (child.geometry.faces) {
                            totalPolygons += child.geometry.faces.length;
                        }
                    }
                }
            });
            
            // Format the polygon count with commas
            const formattedPolygons = totalPolygons > 0 ? 
                Math.round(totalPolygons).toLocaleString() : 'Unknown';
            
            // Update the polygon count in the UI
            modelPolygons.textContent = formattedPolygons;
            
            // Update the model data in memory to store the polygon count
            const modelId = parseInt(document.querySelector('.model-list li.active').dataset.id);
            const modelIndex = models.findIndex(model => model.id === modelId);
            if (modelIndex !== -1) {
                models[modelIndex].polygons = formattedPolygons;
            }
            
            // Center the model horizontally (X and Z)
            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            
            // Position the model on top of the platform
            // We only center X and Z, but position Y so the bottom of the model is at y=0
            currentModel.position.x = -center.x;
            currentModel.position.z = -center.z;
            
            // Calculate the bottom of the model and position it at y=0
            const size = box.getSize(new THREE.Vector3());
            const bottomY = center.y - (size.y / 2);
            currentModel.position.y = -bottomY;
            
            // Adjust camera to fit model
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
            
            // Set camera position
            camera.position.z = cameraZ * 1.5;
            
            // Update controls
            const minDistance = maxDim / 2;
            const maxDistance = cameraZ * 4;
            controls.minDistance = minDistance;
            controls.maxDistance = maxDistance;
            controls.target.set(0, size.y / 4, 0); // Look at the middle of the model
            controls.update();
            
            // Add model to scene
            scene.add(currentModel);
            
            // Reset to normal view mode for the new model
            setViewMode('normal');
            
            // Remove loading indicator
            if (loadingIndicator) loadingIndicator.remove();
        },
        function (xhr) {
            // Progress indicator
            if (xhr.lengthComputable) {
                const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
                if (loadingText) loadingText.textContent = `Loading... ${percentComplete}%`;
            }
        },
        function (error) {
            console.error('Error loading model:', error);
            console.error('Failed to load:', modelPath);
            
            // Remove loading indicator
            if (loadingIndicator) loadingIndicator.remove();
            
            // Show error message
            showErrorMessage(`Failed to load model: ${modelPath}`);
        }
    );
}

// Show error message in the viewer
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'loading-indicator';
    errorDiv.style.color = 'var(--error)';
    
    const errorIcon = document.createElement('div');
    errorIcon.innerHTML = '⚠️';
    errorIcon.style.fontSize = '32px';
    
    const errorText = document.createElement('p');
    errorText.textContent = message;
    
    errorDiv.appendChild(errorIcon);
    errorDiv.appendChild(errorText);
    
    modelViewer.appendChild(errorDiv);
    
    // Update model info
    modelTitle.textContent = "Error";
    modelDescription.textContent = "The model could not be loaded. Please check if the file exists and the path is correct.";
}

// Populate model list
function populateModelList(models) {
    modelList.innerHTML = '';
    
    if (models.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = "No models found";
        emptyMessage.style.color = 'var(--text-secondary)';
        emptyMessage.style.fontStyle = 'italic';
        emptyMessage.style.textAlign = 'center';
        modelList.appendChild(emptyMessage);
        return;
    }
    
    models.forEach(model => {
        const li = document.createElement('li');
        
        const title = document.createElement('div');
        title.textContent = model.title;
        title.style.fontWeight = '500';
        
        const category = document.createElement('div');
        category.textContent = model.category !== '-' ? 
            model.category.charAt(0).toUpperCase() + model.category.slice(1) : 
            'Uncategorized';
        category.style.fontSize = '0.8rem';
        category.style.color = 'var(--text-secondary)';
        
        li.appendChild(title);
        li.appendChild(category);
        li.dataset.id = model.id;
        
        li.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('.model-list li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            li.classList.add('active');
            
            // Display model info
            displayModelInfo(model);
            
            // Load the 3D model with its format
            loadModel(model.path, model.format);
        });
        
        modelList.appendChild(li);
    });
}

// Display model information
function displayModelInfo(model) {
    modelTitle.textContent = model.title;
    modelDescription.textContent = model.description;
    modelDate.textContent = model.date;
    modelCategory.textContent = model.category !== '-' ? 
        model.category.charAt(0).toUpperCase() + model.category.slice(1) : 
        'Uncategorized';
    
    // For polygons, we'll display what we have in the model data
    // but this will be updated with the actual count after the model loads
    modelPolygons.textContent = model.polygons || 'Calculating...';
    
    modelFormat.textContent = model.format.toUpperCase();
}

// Filter models by search term and category
function filterModels() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    const filteredModels = models.filter(model => {
        const matchesSearch = model.title.toLowerCase().includes(searchTerm) || 
                             model.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || model.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    populateModelList(filteredModels);
}

// Initialize the application
function init() {
    // Initialize 3D viewer
    initViewer();
    
    // Initialize view controls
    initViewControls();
    
    // Populate model list
    populateModelList(models);
    
    // Add event listeners for filtering
    searchInput.addEventListener('input', filterModels);
    categoryFilter.addEventListener('change', filterModels);
    
    // Select first model by default if available
    if (models.length > 0) {
        const firstModelItem = modelList.querySelector('li');
        if (firstModelItem) {
            firstModelItem.click();
        }
    }
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
