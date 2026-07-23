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

  public setConfig(config: SpotifyPremiumCardConfig): void {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }

    this._config = config;
  }

  public getCardSize(): number {
    return 6;
  }

  private _callMedia(service: string, data: Record<string, unknown> = {}): void {
    if (!this.hass || !this._config) return;

    this.hass.callService('media_player', service, {
      entity_id: this._config.entity,
      ...data
    });
  }

  private _icon(name: string) {
    const paths: Record<string, string> = {
      volume:
        'M3,9V15H7L12,20V4L7,9H3M14.5,12C14.5,10.23 13.5,8.71 12,8V16C13.5,15.29 14.5,13.77 14.5,12M12,3.23V5.29C14.89,6.15 17,8.83 17,12C17,15.17 14.89,17.85 12,18.71V20.77C16,19.86 19,16.28 19,12C19,7.72 16,4.14 12,3.23Z',
      shuffle:
        'M10.59,9.17L5.41,4L4,5.41L9.17,10.59L10.59,9.17M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4H14.5M14.83,14.83L13.42,16.24L16.55,19.37L14.5,21.41H20V15.91L17.96,17.96L14.83,14.83Z',
      previous:
        'M6,6V18L14.5,12L6,6M16,6V18H18V6H16Z',
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

    const stateObj = this.hass.states[this._config.entity];

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
            <span>0:53</span>
            <div class="progress-track">
              <div class="progress-fill"></div>
              <div class="progress-thumb"></div>
            </div>
            <span>2:17</span>
          </div>

          <div class="meta">
            <div class="title" title=${title}>${title}</div>
            <div class="artist" title=${artist}>${artist}</div>
          </div>

          <div class="controls-grid">
            <button
              class="icon-button"
              @click=${() => this._callMedia('volume_down')}
              aria-label="Bajar volumen"
            >
              ${this._icon('volume')}
            </button>

            <button
              class="icon-button"
              @click=${() =>
                this._callMedia('shuffle_set', {
                  shuffle: !stateObj.attributes.shuffle
                })}
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

            <div class="center-wrap">
              <button
                class="play-button"
                @click=${() =>
                  this._callMedia(isPlaying ? 'media_pause' : 'media_play')}
                aria-label=${isPlaying ? 'Pausar' : 'Reproducir'}
              >
                ${this._icon(isPlaying ? 'pause' : 'play')}
              </button>
            </div>

            <button
              class="icon-button"
              @click=${() => this._callMedia('media_next_track')}
              aria-label="Pista siguiente"
            >
              ${this._icon('next')}
            </button>

            <button
              class="icon-button"
              @click=${() =>
                this._callMedia('repeat_set', {
                  repeat: stateObj.attributes.repeat === 'off' ? 'all' : 'off'
                })}
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
      overflow: hidden;
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
    }

    .progress-track {
      position: relative;
      height: 4px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
    }

    .progress-fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: 35%;
      border-radius: inherit;
      background: rgba(255, 255, 255, 0.9);
    }

    .progress-thumb {
      position: absolute;
      top: 50%;
      left: 35%;
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

    .controls-grid {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      padding-top: 8px;
    }

    .icon-button,
    .play-button {
      display: grid;
      border: none;
      cursor: pointer;
      place-items: center;
      transition:
        transform 0.2s ease,
        color 0.2s ease,
        background 0.2s ease;
    }

    .icon-button {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: transparent;
      color: #9f9f9f;
      flex: 1 1 0;
      min-width: 40px;
    }

    .icon-button:hover {
      color: #d7d7d7;
      transform: scale(1.06);
    }

    .icon-button:active,
    .play-button:active {
      transform: scale(0.95);
    }

    .center-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-inline: 4px;
    }

    .play-button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #fff;
      color: #111;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
    }

    .play-button:hover {
      transform: scale(1.05);
    }

    .icon-button svg,
    .play-button svg {
      display: block;
      width: 22px;
      height: 22px;
      fill: currentColor;
    }

    .play-button svg {
      width: 30px;
      height: 30px;
    }

    .error {
      padding: 16px;
      color: #fff;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'spotify-premium-card': SpotifyPremiumCard;
  }
}
