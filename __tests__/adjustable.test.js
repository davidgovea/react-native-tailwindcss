import color from '../color';
import generator from '../util/generator';
import theme from './fixtures/testConfigHandler';

test('custom colors', () => {
    const result = generator.generate('text', 'color', generator.generateColors(theme.colors));

    expect(result).toMatchSnapshot();
});

test('custom fonts', () => {
    const result = generator.generate('font', 'fontFamily', theme.fontFamily);

    expect(result).toMatchSnapshot();
});

test('custom margin', () => {
    const result = generator.generate('m', 'margin', theme.margin, [
        ['x', 'marginHorizontal'],
        ['y', 'marginVertical'],
        ['t', 'marginTop'],
        ['r', 'marginRight'],
        ['b', 'marginBottom'],
        ['l', 'marginLeft'],
    ]);

    expect(result).toMatchSnapshot();
});

test('negative values and keys', () => {
    const result = generator.generate('z', 'zIndex', theme.zIndex);
    const result2 = generator.generate('inset', ['top', 'bottom', 'left', 'right'], theme.inset, [
        ['x', ['left', 'right']],
        ['y', ['top', 'bottom']],
    ]);
    const result3 = generator.generate('flex', 'flex', theme.flex);

    expect(result).toMatchSnapshot();
    expect(result2).toMatchSnapshot();
    expect(result3).toMatchSnapshot();
});
