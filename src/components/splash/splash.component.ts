import { Component, OnInit } from '@angular/core';

import { constants } from '../../utils/constants';

@Component({
  selector: 'splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit
{
  fadeInAnimation: boolean;
  fadeOutAnimation: boolean;

  constructor()
  {
    this.fadeInAnimation = false;
    this.fadeOutAnimation = false;
  }

  ngOnInit()
  {
    setTimeout(() =>
    {
      this.fadeInAnimation = true;
    }, constants.SPLASH_ANIMATION_FADE_IN_DELAY);

    setTimeout(() =>
    {
      this.fadeOutAnimation = true;
    }, constants.SPLASH_ANIMATION_FADE_OUT_DELAY);
  }
}
