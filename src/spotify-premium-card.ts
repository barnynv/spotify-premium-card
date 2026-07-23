//gfkgjsdfgslñ
import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface HomeAssistant {
  states: Record<string, any>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ): void;
}

interface SpotifyPremiumCardConfig {
  type: string;
  entity: string;
  name?: string;
}

@customElement('spotify-premium-card')
export class SpotifyPremiumCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: SpotifyPremiumCardConfig;
  @state() private _showVolume = false;
  @state() private _localShuffle?: boolean;
  @state() private _localRepeat?: string;
  @state() private _localMuted = false;
  @state() private _currentPosition = 0;
  @state() private _localVolume?: number;

  private _volumeTimer?: number;
  private _positionTimer?: number;
  private _lastPositionUpdatedAt?: string;
  private _lastTrackKey?: string;
  private _volumeBeforeMute = 0.5;

  public setConfig(config: SpotifyPremiumCardConfig): void {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }

    this._config = config;
  }

  public getCardSize(): number {
    return 6;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearVolumeTimer();

    if (this._positionTimer) {
      window.clearInterval(this._positionTimer);
      this._positionTimer = undefined;
    }
  }

  protected updated(): void {
    const stateObj = this._getStateObj();

    if (!stateObj) {
      return;
    }

    const trackKey = [
      stateObj.attributes.media_content_id ?? '',
      stateObj.attributes.media_title ?? '',
      stateObj.attributes.media_artist ?? ''
    ].join('|');

    if (trackKey !== this._lastTrackKey) {
      this._lastTrackKey = trackKey;
      this._currentPosition = Number(stateObj.attributes.media_position ?? 0);
      this._lastPositionUpdatedAt = String(
        stateObj.attributes.media_position_updated_at ?? ''
      );
    }

    const reportedPosition = Number(stateObj.attributes.media_position ?? 0);
    const reportedUpdatedAt = String(
      stateObj.attributes.media_position_updated_at ?? ''
    );

    if (
      reportedUpdatedAt &&
      reportedUpdatedAt !== this._lastPositionUpdatedAt
    ) {
      this._lastPositionUpdatedAt = reportedUpdatedAt;
      this._currentPosition = reportedPosition;
    }

    if (stateObj.state === 'playing' && !this._positionTimer) {
      this._positionTimer = window.setInterval(() => {
        const currentState = this._getStateObj();
        const duration = Number(
          currentState?.attributes.media_duration ?? 0
        );

        if (
          currentState?.state === 'playing' &&
          duration > 0 &&
          this._currentPosition < duration
        ) {
          this._currentPosition += 1;
        }
      }, 1000);
    }

    if (stateObj.state !== 'playing' && this._positionTimer) {
      window.clearInterval(this._positionTimer);
      this._positionTimer = undefined;
    }
  }

  private _getStateObj() {
    if (!this.hass || !this._config) {
      return undefined;
    }

    return this.hass.states[this._config.entity];
  }

  private _callMedia(
    service: string,
    data: Record<string, unknown> = {}
  ): void {
    if (!this.hass || !this._config) {
      return;
    }

    this.hass.callService('media_player', service, {
      entity_id: this._config.entity,
      ...data
    });
  }

  private _formatTime(seconds: number): string {
    const total = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(total / 60);
    const remainder = total % 60;

    return `${minutes}:${String(remainder).padStart(2, '0')}`;
  }

  private _clearVolumeTimer(): void {
    if (this._volumeTimer) {
      window.clearTimeout(this._volumeTimer);
      this._volumeTimer = undefined;
    }
  }

  private _startVolumeTimer(): void {
    this._clearVolumeTimer();

    this._volumeTimer = window.setTimeout(() => {
      this._showVolume = false;
    }, 10000);
  }

  private _handleVolumeClick(): void {
    const stateObj = this._getStateObj();

    if (!stateObj) {
      return;
    }

    if (!this._showVolume) {
      this._localMuted = false;
      this._showVolume = true;
      this._startVolumeTimer();
      return;
    }

    const reportedVolume = Number(stateObj.attributes.volume_level ?? 0.5);
    const currentVolume = this._localVolume ?? reportedVolume;

    if (!this._localMuted && currentVolume > 0) {
      this._volumeBeforeMute = currentVolume;
      this._localMuted = true;
      this._localVolume = 0;

      this._callMedia('volume_set', {
        volume_level: 0
      });
    } else {
      const restoredVolume = Math.max(this._volumeBeforeMute, 0.05);

      this._localMuted = false;
      this._localVolume = restoredVolume;

      this._callMedia('volume_set', {
        volume_level: restoredVolume
      });
    }

    this._startVolumeTimer();
  }

  private _handleVolumeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const volume = Math.max(0, Math.min(1, Number(input.value) / 100));

    this._localVolume = volume;
    this._localMuted = volume === 0;

    if (volume > 0) {
      this._volumeBeforeMute = volume;
    }

    this._callMedia('volume_set', {
      volume_level: volume
    });

    this._startVolumeTimer();
  }

  private _toggleShuffle(isShuffleActive: boolean): void {
    const nextShuffle = !isShuffleActive;
    this._localShuffle = nextShuffle;

    this._callMedia('shuffle_set', {
      shuffle: nextShuffle
    });
  }

  private _toggleRepeat(repeatMode: string): void {
    const nextRepeat = repeatMode === 'off' ? 'all' : 'off';
    this._localRepeat = nextRepeat;

    this._callMedia('repeat_set', {
      repeat: nextRepeat
    });
  }

  private _icon(name: string) {
    const paths: Record<string, string> = {
      volume:
        'M3,9V15H7L12,20V4L7,9H3M14.5,12C14.5,10.23 13.5,8.71 12,8V16C13.5,15.29 14.5,13.77 14.5,12M12,3.23V5.29C14.89,6.15 17,8.83 17,12C17,15.17 14.89,17.85 12,18.71V20.77C16,19.86 19,16.28 19,12C19,7.72 16,4.14 12,3.23Z',
      muted:
        'M3,9V15H7L12,20V4L7,9H3M16.59,12L19,9.59L20.41,11L18,13.41L20.41,15.83L19,17.24L16.59,14.83L14.17,17.24L12.76,15.83L15.17,13.41L12.76,11L14.17,9.59L16.59,12Z',
      shuffle:
        'M10.59,9.17L5.41,4L4,5.41L9.17,10.59L10.59,9.17M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4H14.5M14.83,14.83L13.42,16.24L16.55,19.37L14.5,21.41H20V15.91L17.96,17.96L14.83,14.83Z',
      previous:
        'M18,6V18L9.5,12L18,6M6,6V18H8V6H6Z',
      play:
        'M8,5.14V18.86C8,19.65 8.87,20.13 9.54,19.71L20.31,12.85C20.93,12.45 20.93,11.55 20.31,11.15L9.54,4.29C8.87,3.87 8,4.35 8,5.14Z',
      pause:
        'M14,19H18V5H14M6,19H10V5H6V19Z',
      next:
        'M4,6V18L12.5,12L4,6M14,6V18H16V6H14Z',
      repeat:
        'M17,17H7V14L3,18L7,22V19H19V13H17V17M7,7H17V10L21,6L17,2V5H5V11H7V7Z',
      cast:
        'M1,18V21H4C4,19.34 2.66,18 1,18M1,14V16C3.76,16 6,18.24 6,21H8C8,17.13 4.87,14 1,14M1,10V12C5.97,12 10,16.03 10,21H12C12,14.92 7.07,10 1,10M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H13V21H21C22.1,21 23,20.1 23,19V5C23,3.89 22.1,3 21,3Z'
    };

    return html`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${paths[name] ?? paths.play}></path>
      </svg>
    `;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const stateObj = this._getStateObj();

    if (!stateObj) {
      return html`
        <ha-card>
          <div class="error">Entity not found: ${this._config.entity}</div>
        </ha-card>
      `;
    }

    const title =
      stateObj.attributes.media_title ||
      this._config.name ||
      stateObj.attributes.friendly_name ||
      'Nothing playing';

    const artist =
      stateObj.attributes.media_artist ||
      stateObj.state ||
      'Unknown artist';

    const picture = stateObj.attributes.entity_picture;
    const isPlaying = stateObj.state === 'playing';

    const reportedShuffle = Boolean(stateObj.attributes.shuffle);
    const reportedRepeat = String(stateObj.attributes.repeat ?? 'off');

    const isShuffleActive =
      this._localShuffle !== undefined
        ? this._localShuffle
        : reportedShuffle;

    const repeatMode =
      this._localRepeat !== undefined
        ? this._localRepeat
        : reportedRepeat;

    const isRepeatActive =
      repeatMode === 'all' || repeatMode === 'one';

    const reportedVolume = Number(stateObj.attributes.volume_level ?? 0.5);
    const volume = this._localVolume ?? reportedVolume;

    const isMuted =
      this._localMuted ||
      Boolean(stateObj.attributes.is_volume_muted) ||
      volume === 0;

    const volumeLevel = Math.round((isMuted ? 0 : volume) * 100);

    const duration = Number(stateObj.attributes.media_duration ?? 0);
    const reportedPosition = Number(stateObj.attributes.media_position ?? 0);

    const currentPosition = Math.min(
      this._currentPosition || reportedPosition,
      duration > 0 ? duration : Number.MAX_SAFE_INTEGER
    );

    const progress =
      duration > 0
        ? Math.max(0, Math.min(100, (currentPosition / duration) * 100))
        : 0;

    return html`
      <ha-card>
        <div class="card">
          <div
            class="artwork"
            style=${picture ? `background-image: url("${picture}")` : ''}
          >
            ${!picture
              ? html`<div class="artwork-placeholder">♪</div>`
              : nothing}
          </div>

          <div class="progress-row">
            <span>${this._formatTime(currentPosition)}</span>

            <div class="progress-track">
              <div
                class="progress-fill"
                style=${`width: ${progress}%`}
              ></div>
              <div
                class="progress-thumb"
                style=${`left: ${progress}%`}
              ></div>
            </div>

            <span>${this._formatTime(duration)}</span>
          </div>

          <div class="meta">
            <div class="title" title=${title}>${title}</div>
            <div class="artist" title=${artist}>${artist}</div>
          </div>

          <div class="controls-row">
            <div class="volume-control">
              <button
                class="icon-button"
                @click=${this._handleVolumeClick}
                aria-label=${isMuted ? 'Activar sonido' : 'Control de volumen'}
              >
                ${this._icon(isMuted ? 'muted' : 'volume')}
              </button>

              ${this._showVolume
                ? html`
                    <div class="volume-popover">
                      <div class="volume-value">${volumeLevel}%</div>

                      <input
                        class="volume-slider"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        .value=${String(volumeLevel)}
                        style=${`--volume-progress: ${volumeLevel}%`}
                        @input=${this._handleVolumeInput}
                        aria-label="Nivel de volumen"
                      />
                    </div>
                  `
                : nothing}
            </div>

            <button
              class=${`icon-button ${
                isShuffleActive ? 'is-active' : ''
              }`}
              @click=${() => this._toggleShuffle(isShuffleActive)}
              aria-label="Reproducción aleatoria"
            >
              ${this._icon('shuffle')}
            </button>

            <button
              class="icon-button"
              @click=${() => this._callMedia('media_previous_track')}
              aria-label="Pista anterior"
            >
              ${this._icon('previous')}
            </button>

            <button
              class="play-button"
              @click=${() =>
                this._callMedia(isPlaying ? 'media_pause' : 'media_play')}
              aria-label=${isPlaying ? 'Pausar' : 'Reproducir'}
            >
              ${this._icon(isPlaying ? 'pause' : 'play')}
            </button>

            <button
              class="icon-button"
              @click=${() => this._callMedia('media_next_track')}
              aria-label="Pista siguiente"
            >
              ${this._icon('next')}
            </button>

            <button
              class=${`icon-button ${
                isRepeatActive ? 'is-active' : ''
              }`}
              @click=${() => this._toggleRepeat(repeatMode)}
              aria-label="Repetir"
            >
              ${this._icon('repeat')}
            </button>

            <button
              class="icon-button"
              aria-label="Dispositivo de reproducción"
            >
              ${this._icon('cast')}
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      overflow: visible;
      border-radius: 24px;
      background: #121212;
      color: #fff;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .artwork {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      border-radius: 18px;
      background: linear-gradient(135deg, #232323, #101010);
      background-position: center;
      background-size: cover;
    }

    .artwork::after {
      position: absolute;
      inset: 0;
      content: '';
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.18),
        rgba(0, 0, 0, 0.02)
      );
    }

    .artwork-placeholder {
      display: grid;
      width: 100%;
      height: 100%;
      place-items: center;
      color: rgba(255, 255, 255, 0.45);
      font-size: 64px;
    }

    .progress-row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 10px;
      align-items: center;
      color: rgba(255, 255, 255, 0.72);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    .progress-track {
      position: relative;
      height: 4px;
      overflow: visible;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
    }

    .progress-fill {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: inherit;
      background: rgba(255, 255, 255, 0.9);
    }

    .progress-thumb {
      position: absolute;
      top: 50%;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fff;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .title {
      overflow: hidden;
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .artist {
      overflow: hidden;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .controls-row {
      display: flex;
      width: 100%;
      min-width: 0;
      gap: 2px;
      align-items: center;
      justify-content: space-between;
      padding-top: 8px;
    }

    .volume-control {
      position: relative;
      display: flex;
      flex: 1 1 0;
      min-width: 0;
      justify-content: center;
    }

    .icon-button,
    .play-button {
      display: grid;
      border: none;
      cursor: pointer;
      place-items: center;
      transition:
        transform 180ms ease,
        color 180ms ease,
        background 180ms ease;
    }

    .icon-button {
      flex: 1 1 0;
      min-width: 30px;
      height: 38px;
      border-radius: 50%;
      background: transparent;
      color: #a7a7a7;
    }

    .icon-button:hover {
      color: #fff;
      transform: scale(1.08);
    }

    .icon-button.is-active {
      color: #1db954;
    }

    .icon-button.is-active:hover {
      color: #1ed760;
    }

    .icon-button:active,
    .play-button:active {
      transform: scale(0.95);
    }

    .play-button {
      flex: 0 0 58px;
      width: 58px;
      height: 58px;
      margin-inline: 2px;
      border-radius: 50%;
      background: #fff;
      color: #111;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
    }

    .play-button:hover {
      transform: scale(1.05);
    }

    .icon-button svg,
    .play-button svg {
      display: block;
      width: 21px;
      height: 21px;
      fill: currentColor;
    }

    .play-button svg {
      width: 28px;
      height: 28px;
    }

    .volume-popover {
      position: absolute;
      z-index: 10;
      bottom: calc(100% + 12px);
      left: 50%;
      display: flex;
      width: 54px;
      height: 182px;
      padding: 10px 8px;
      transform: translateX(-50%);
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      background: rgba(30, 30, 30, 0.98);
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.42);
    }

    .volume-value {
      position: absolute;
      top: 9px;
      color: rgba(255, 255, 255, 0.72);
      font-size: 11px;
      font-variant-numeric: tabular-nums;
    }

    .volume-slider {
      width: 132px;
      height: 22px;
      margin-top: 24px;
      cursor: pointer;
      accent-color: #1db954;
      transform: rotate(-90deg);
    }

    .volume-slider::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 999px;
      background: linear-gradient(
        to right,
        #1db954 0%,
        #1db954 var(--volume-progress, 50%),
        rgba(255, 255, 255, 0.2) var(--volume-progress, 50%),
        rgba(255, 255, 255, 0.2) 100%
      );
    }

    .volume-slider::-webkit-slider-thumb {
      width: 14px;
      height: 14px;
      margin-top: -5px;
      border: none;
      border-radius: 50%;
      appearance: none;
      background: #fff;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    }

    .volume-slider::-moz-range-track {
      height: 4px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.2);
    }

    .volume-slider::-moz-range-progress {
      height: 4px;
      border-radius: 999px;
      background: #1db954;
    }

    .volume-slider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border: none;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    }

    .error {
      padding: 16px;
      color: #fff;
    }

    @media (max-width: 360px) {
      .icon-button {
        min-width: 26px;
        height: 34px;
      }

      .icon-button svg {
        width: 19px;
        height: 19px;
      }

      .play-button {
        flex-basis: 52px;
        width: 52px;
        height: 52px;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'spotify-premium-card': SpotifyPremiumCard;
  }
}
