import { _decorator, AudioClip, AudioSource, Component, director, Node } from 'cc';
import { resAssetLoad } from '../Base/Utils';
import { MUSIC_PATH_ENUM } from '../Data/Enum';
import Singleton from '../Base/Singleton';
const { ccclass, property } = _decorator;

@ccclass('AudioBGMManager')
export class AudioBGMManager extends Singleton {
    static get Instance() {
        return super.GetInstance<AudioBGMManager>()
    }
    constructor() {
        super()
        this.reset()
    }
    audioSource: AudioSource = null
    // private _volume: number = 0.3;


    private _musicBGMVolume: number = 0.3;
    


    public get musicBGMVolume(): number {
        return this._musicBGMVolume;
    }
    public set musicBGMVolume(value: number) {
        this._musicBGMVolume = value;
        this.audioSource.volume = value;
    }

    
    reset() {
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';
        director.getScene().addChild(audioMgr);
        director.addPersistRootNode(audioMgr);
        this.audioSource = audioMgr.addComponent(AudioSource);
    }
    /**
     * @en
     * play short audio, such as strikes,explosions
     * @zh
     * 播放短音频,比如 打击音效，爆炸音效等
     * @param sound clip or url for the audio
     * @param volume 
     */
    // async playOneShot(sound: MUSIC_PATH_ENUM | AudioClip, volume?: number) {
    //     if (sound instanceof AudioClip) {
    //         this.audioSource.playOneShot(sound, volume || this._soundEffectVolume);
    //     } else {
    //         const data = await resAssetLoad<AudioClip>(sound, AudioClip)
    //         this.audioSource.playOneShot(data, volume || this._soundEffectVolume);
    //     }
    // }
    /**
     * @en
     * play long audio, such as the bg music
     * @zh
     * 播放长音频，比如 背景音乐
     * @param sound clip or url for the sound
     * @param volume 
     */
    async play(sound: AudioClip | MUSIC_PATH_ENUM, volume?: number) {
        if (sound instanceof AudioClip) {
            this.audioSource.stop();
            this.audioSource.clip = sound;
            this.audioSource.loop = true;
            this.audioSource.play();
            this.audioSource.volume = volume || this._musicBGMVolume;
        }
        else {
            const clip = await resAssetLoad<AudioClip>(sound, AudioClip)
            this.audioSource.stop();
            this.audioSource.clip = clip;
            this.audioSource.loop = true;
            this.audioSource.play();
            this.audioSource.volume = volume || this._musicBGMVolume;
        }
    }
    stop() {
        this.audioSource.stop();
    }
    pause() {
        this.audioSource.pause();
    }
    resume() {
        this.audioSource.play();
    }
}

