import { Component, Host, Prop, State, h } from '@stencil/core';
import { axiosStore } from '../../api/axios_instance/axiosStore';

declare global {
  interface Window { navigation: any; }
}

@Component({
  tag: 'patient-app',
  styleUrl: 'patient-app.css',
  shadow: true,
})
export class PatientApp {
  @State() private relativePath = "";
  @State() element: 'list' | 'patient'

  @Prop() basePath: string="";
  @Prop() apiBase: string;

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || "/").pathname

    const toRelative = (path: string) => {
      if (path.startsWith( baseUri )) {
        this.relativePath = path.slice(baseUri.length)
      } else {
        this.relativePath = ""
      }

      switch(this.relativePath) {
        case 'patient':
          this.element = 'patient'
          break
        default:
          this.element = 'list'
      }
    }

    window.navigation?.addEventListener("navigate", (ev: Event) => {
      if ((ev as any).canIntercept) { (ev as any).intercept(); }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    axiosStore.setBaseURL(this.apiBase);

    toRelative(location.pathname)
  }

  navigate(pathObj: string) {
    const {path, queryParams} = JSON.parse(pathObj) as {path: string, queryParams: Record<string, string> | undefined}
    const targetURL = new URL(path, new URL(this.basePath, document.baseURI))

    if ( queryParams ) {
      const searchParams = new URLSearchParams(queryParams)
      targetURL.search = searchParams.toString()
    }

    window.navigation.navigate(targetURL)
  }

  render() {
    let html

    switch(this.element) {
      case 'list':
        html = <patient-list onentry-clicked={ (ev: CustomEvent<string>)=> this.navigate(ev.detail) } ></patient-list>
        break
      case 'patient':
        html = <random-patient onentry-clicked={ (ev: CustomEvent<string>)=> this.navigate(ev.detail) } ></random-patient>
        break
      default:
        html = <h1>Oopsie Daisy</h1>
    }
    return (
      <Host>
        {
          html
        }
      </Host>
    );
  }
}
