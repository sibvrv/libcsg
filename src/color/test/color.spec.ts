import {circle, cube, cylinder, sphere, square} from '@root/primitives';
import {color, css2rgb, hsl2rgb, hsv2rgb, html2rgb, rgb2hsl, rgb2hsv, rgb2html} from '../';
import {expect} from 'chai';

describe('Color Library', () => {
  describe('Color Conversion', () => {
    it('css2rgb', () => {
      const c1 = css2rgb('black');
      const e1 = [0 / 255, 0 / 255, 0 / 255];
      expect(c1).to.deep.eq(e1);

      const c2 = css2rgb('yellowgreen');
      const e2 = [154 / 255, 205 / 255, 50 / 255];
      expect(c2).to.deep.eq(e2);

      const c3 = css2rgb('jscad');
      expect(c3).to.deep.eq([0, 0, 0]);
    });

    it('rgb2hsl', () => {
      const obs = rgb2hsl(1, 0, 0);
      const expColor = [0, 1, 0.5];

      expect(obs).to.deep.eq(expColor);
    });

    it('hsl2rgb', () => {
      const obs = hsl2rgb(0, 1, 0);
      const expColor = [0, 0, 0];

      expect(obs).to.deep.eq(expColor);
    });

    it('rgb2hsv', () => {
      const obs = rgb2hsv(1, 0, 0.5);
      const expColor = [0.9166666666666666, 1, 1];

      expect(obs).to.deep.eq(expColor);
    });

    it('hsv2rgb', () => {
      const obs = hsv2rgb(0, 0.2, 0);
      const expColor = [0, 0, 0];

      expect(obs).to.deep.eq(expColor);
    });

    it('html2rgb', () => {
      const obs = html2rgb('#000000');
      const expColor = [0, 0, 0];

      expect(obs).to.deep.eq(expColor);
    });

    it('rgb2html', () => {
      const html = rgb2html(1, 0, 0.5);
      const expHtml = '#ff007f';

      expect(html).to.deep.eq(expHtml);
    });
  });

  describe('use of color', () => {
    it('color (rgb, on 3d objects)', () => {
      const obs = color([1, 0, 0], cube(), sphere());
      const expColor = [1, 0, 0, 1];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);
    });

    it.skip('color (rgb, on 2d objects)', () => {
      const obs = color([1, 0, 0], square(), circle());
      const expColor = [1, 0, 0, 1];

      expect(obs.sides[0].shared.color).to.deep.eq(expColor);
      expect(obs.sides[obs.sides.length - 1].shared.color).to.deep.eq(expColor);
    });

    it('color (rgba, on 3d objects)', () => {
      const obs = color([1, 0, 0, 0.5], cube(), sphere());
      const expColor = [1, 0, 0, 0.5];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);
    });

    it.skip('color (rgba, on 2d objects)', () => {
      const obs = color([1, 0, 0, 0.5], square(), circle());
      const expColor = [1, 0, 0, 0.5];

      expect(obs.sides[0].shared).to.have.own.property('color');

      expect(obs.sides[0].shared.color).to.deep.eq(expColor);
      expect(obs.sides[obs.sides.length - 1].shared.color).to.deep.eq(expColor);
    });

    it('color (rgba, on array of 3D objects)', () => {
      const obs = color([1, 0, 0, 0.5], [cube(), sphere()]);
      const expColor = [1, 0, 0, 0.5];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);
    });

    it.skip('color (rgba, on array of 2d objects)', () => {
      const obs = color([1, 0, 0, 0.5], [square(), circle()]);
      const expColor = [1, 0, 0, 0.5];

      expect(obs.sides[0].shared).to.deep.eq(expColor);
      expect(obs.sides[obs.sides.length - 1].shared).to.deep.eq(expColor);
    });

    it('color (by name, on 3d objects)', () => {
      let obs = color('red', cube());
      let expColor = [1, 0, 0, 1];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);

      obs = color('green', cube(), sphere());
      expColor = [0, 128 / 255, 0, 1];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);

      obs = color('blue', cube(), sphere(), cylinder());
      expColor = [0, 0, 1, 1];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);
    });

    it.skip('color (by name, on 2d objects)', () => {
      const obs = color('red', square(), circle());
      const expColor = [1, 0, 0, 1];

      expect(obs.sides[0].shared.color).to.deep.eq(expColor);
      expect(obs.sides[obs.sides.length - 1].shared.color).to.deep.eq(expColor);
    });

    it('color (by name and alpha, on 3d objects)', () => {
      let obs = color('red', 0.5, cube());
      let expColor = [1, 0, 0, 0.5];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);

      obs = color('green', 0.8, cube(), sphere());
      expColor = [0, 128 / 255, 0, 0.8];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);

      obs = color('blue', 0.2, cube(), sphere(), cylinder());
      expColor = [0, 0, 1, 0.2];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);
    });

    it.skip('color (by name and alpha, on 2d objects)', () => {
      const obs = color('red', 0.1, square(), circle());
      const expColor = {color: [1, 0, 0, 0.5]};

      expect(obs.sides[0].shared).to.deep.eq(expColor);
      expect(obs.sides[obs.sides.length - 1].shared).to.deep.eq(expColor);
    });

    it('color (by name and alpha, on array of 3d objects)', () => {
      const obs = color('red', 0.7, [cube(), sphere()]);
      const expColor = [1, 0, 0, 0.7];

      expect(obs.polygons[0].shared.color).to.deep.eq(expColor);
      expect(obs.polygons[obs.polygons.length - 1].shared.color).to.deep.eq(expColor);
    });

    it.skip('color (by name and alpha, on array of 2d objects)', () => {
      const obs = color('red', 0.5, [square(), circle()]);
      const expColor = {color: [1, 0, 0, 0.5]};

      expect(obs.sides[0].shared).to.deep.eq(expColor);
      expect(obs.sides[obs.sides.length - 1].shared).to.deep.eq(expColor);
    });
  });
});

