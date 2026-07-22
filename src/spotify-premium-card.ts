import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface HomeAssistant {
  states: Record<string, any>;
  callService(domain: string, service: string, serviceData?: Record<string, any>): void;
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

  private _callMedia(service: string): void {
    if (!this.hass || !this._config) return;
    this.hass.callService('media_player', service, {
      entity_id: this._config.entity
    });
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

    const artist = stateObj.attributes.media_artist || stateObj.state || 'Unknown artist';
    const picture = stateObj.attributes.entity_picture;
    const isPlaying = stateObj.state === 'playing';

    return html`
      <ha-card>
        <div class="card">
          <div class="artwork" style=${picture ? `background-image:url(${picture})` : ''}>
            ${!picture ? html`<div class="artwork-placeholder">♪</div>` : nothing}
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
            <button class="icon-button" @click=${() => this._callMedia('volume_down')} aria-label="Volume down">🔈</button>
            <button class="icon-button" @click=${() => this._callMedia('shuffle_set')} aria-label="Shuffle">🔀</button>
            <button class="icon-button" @click=${() => this._callMedia('media_previous_track')} aria-label="Previous">⏮</button>

            <div class="center-wrap">
              <button
                class="play-button"
                @click=${() => this._callMedia(isPlaying ? 'media_pause' : 'media_play')}
                aria-label=${isPlaying ? 'Pause' : 'Play'}
              >
                ${isPlaying ? '❚❚' : '▶'}
              </button>
            </div>

            <button class="icon-button" @click=${() => this._callMedia('media_next_track')} aria-label="Next">⏭</button>
            <button class="icon-button" @click=${() => this._callMedia('repeat_set')} aria-label="Repeat">🔁</button>
            <button class="icon-button" @click=${() => this._callMedia('media_stop')} aria-label="Device">📺</button>
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
      border-radius: 18px;
      background: linear-gradient(135deg, #232323, #101010);
      background-size: cover;
      background-position: center;
      overflow: hidden;
    }

    .artwork::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.02));
    }

    .artwork-placeholder {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      color: rgba(255, 255, 255, 0.45);
      font-size: 64px;
    }

    .progress-row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 10px;
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
      font-size: 20px;
      line-height: 1.2;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .artist {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .controls-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      align-items: center;
      justify-items: center;
      gap: 12px 10px;
      padding-top: 4px;
    }

    .icon-button,
    .play-button {
      border: none;
      background: transparent;
      color: #9f9f9f;
      cursor: pointer;
      transition: transform 0.2s ease, color 0.2s ease, background 0.2s ease;
    }

    .icon-button {
      width: 44px;
      height: 44px;
      font-size: 20px;
      border-radius: 50%;
    }

    .icon-button:hover {
      color: #d7d7d7;
      transform: scale(1.06);
    }

    .center-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      grid-column: 2;
    }

    .play-button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #ffffff;
      color: #111111;
      font-size: 24px;
      font-weight: 700;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
    }

    .play-button:hover {
      transform: scale(1.05);
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
