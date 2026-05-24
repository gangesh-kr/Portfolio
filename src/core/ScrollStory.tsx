import gsap from 'gsap';
import * as THREE from 'three';

export interface StoryChapter {
    id: string;
    label: string;
    startProgress: number; // 0-1 normalized scroll progress
    endProgress: number;
    camera: {
        position: THREE.Vector3;
        lookAt: THREE.Vector3;
        fov?: number;
    };
    scene: {
        fogDensity?: number;
        bloomIntensity?: number;
        galaxyOpacity?: number;
        heroOpacity?: number;
        rocketVisible?: boolean;
    };
}

export const STORY_CHAPTERS: StoryChapter[] = [
    {
        id: 'hero',
        label: 'Entry Point',
        startProgress: 0,
        endProgress: 0.15,
        camera: {
            position: new THREE.Vector3(0, 0, 5),
            lookAt: new THREE.Vector3(0, 0, 0),
            fov: 35,
        },
        scene: {
            fogDensity: 0.02,
            bloomIntensity: 1.5,
            galaxyOpacity: 1,
            heroOpacity: 1,
            rocketVisible: true,
        },
    },
    {
        id: 'warp',
        label: 'Warp Drive',
        startProgress: 0.15,
        endProgress: 0.30,
        camera: {
            position: new THREE.Vector3(0, -2, 3),
            lookAt: new THREE.Vector3(0, -2, 0),
            fov: 55,
        },
        scene: {
            fogDensity: 0.008,
            bloomIntensity: 2.5,
            galaxyOpacity: 1.5,
            heroOpacity: 0,
            rocketVisible: true,
        },
    },
    {
        id: 'skills',
        label: 'Skills Orbit',
        startProgress: 0.30,
        endProgress: 0.55,
        camera: {
            position: new THREE.Vector3(-3, -5, 4),
            lookAt: new THREE.Vector3(0, -5, 0),
            fov: 45,
        },
        scene: {
            fogDensity: 0.015,
            bloomIntensity: 1.8,
            galaxyOpacity: 0.6,
            heroOpacity: 0,
            rocketVisible: false,
        },
    },
    {
        id: 'experience',
        label: 'Mission Log',
        startProgress: 0.55,
        endProgress: 0.78,
        camera: {
            position: new THREE.Vector3(4, -10, 3),
            lookAt: new THREE.Vector3(0, -10, 0),
            fov: 40,
        },
        scene: {
            fogDensity: 0.025,
            bloomIntensity: 1.2,
            galaxyOpacity: 0.4,
            heroOpacity: 0,
            rocketVisible: false,
        },
    },
    {
        id: 'contact',
        label: 'Transmission',
        startProgress: 0.78,
        endProgress: 1.0,
        camera: {
            position: new THREE.Vector3(0, -15, 6),
            lookAt: new THREE.Vector3(0, -15, 0),
            fov: 35,
        },
        scene: {
            fogDensity: 0.01,
            bloomIntensity: 2.0,
            galaxyOpacity: 1.2,
            heroOpacity: 0,
            rocketVisible: false,
        },
    },
];

export function getChapterAtProgress(progress: number): StoryChapter {
    for (let i = STORY_CHAPTERS.length - 1; i >= 0; i--) {
        if (progress >= STORY_CHAPTERS[i].startProgress) {
            return STORY_CHAPTERS[i];
        }
    }
    return STORY_CHAPTERS[0];
}

export function getLerpedCameraState(progress: number) {
    // Find surrounding chapters
    let fromChapter = STORY_CHAPTERS[0];
    let toChapter = STORY_CHAPTERS[0];
    let t = 0;

    for (let i = 0; i < STORY_CHAPTERS.length - 1; i++) {
        const curr = STORY_CHAPTERS[i];
        const next = STORY_CHAPTERS[i + 1];
        if (progress >= curr.startProgress && progress < next.startProgress) {
            fromChapter = curr;
            toChapter = next;
            t = (progress - curr.startProgress) / (next.startProgress - curr.startProgress);
            // Smooth easing
            t = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            break;
        }
    }

    if (progress >= STORY_CHAPTERS[STORY_CHAPTERS.length - 1].startProgress) {
        return {
            chapter: STORY_CHAPTERS[STORY_CHAPTERS.length - 1],
            camera: STORY_CHAPTERS[STORY_CHAPTERS.length - 1].camera,
            scene: STORY_CHAPTERS[STORY_CHAPTERS.length - 1].scene,
            t: 1,
        };
    }

    const lerpedPos = new THREE.Vector3().lerpVectors(
        fromChapter.camera.position,
        toChapter.camera.position,
        t
    );
    const lerpedLookAt = new THREE.Vector3().lerpVectors(
        fromChapter.camera.lookAt,
        toChapter.camera.lookAt,
        t
    );
    const lerpedFov = THREE.MathUtils.lerp(
        fromChapter.camera.fov ?? 35,
        toChapter.camera.fov ?? 35,
        t
    );

    const lerpScene = {
        fogDensity: THREE.MathUtils.lerp(
            fromChapter.scene.fogDensity ?? 0.02,
            toChapter.scene.fogDensity ?? 0.02,
            t
        ),
        bloomIntensity: THREE.MathUtils.lerp(
            fromChapter.scene.bloomIntensity ?? 1.5,
            toChapter.scene.bloomIntensity ?? 1.5,
            t
        ),
        galaxyOpacity: THREE.MathUtils.lerp(
            fromChapter.scene.galaxyOpacity ?? 1,
            toChapter.scene.galaxyOpacity ?? 1,
            t
        ),
        heroOpacity: THREE.MathUtils.lerp(
            fromChapter.scene.heroOpacity ?? 1,
            toChapter.scene.heroOpacity ?? 0,
            t
        ),
        rocketVisible:
            t < 0.5
                ? fromChapter.scene.rocketVisible
                : toChapter.scene.rocketVisible,
    };

    return {
        chapter: fromChapter,
        camera: {
            position: lerpedPos,
            lookAt: lerpedLookAt,
            fov: lerpedFov,
        },
        scene: lerpScene,
        t,
    };
}