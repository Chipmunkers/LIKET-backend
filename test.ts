class Children {
  constructor(
    public value: number,
    public candy: number,
    public flag: boolean,
  ) {}
}

function candy(ratings: number[]): number {
  const children: Children[] = ratings.map(
    (rating) => new Children(rating, 1, false),
  );

  let minimumCandy = 1;
  for (let i = 1; i < children.length; i++) {
    const currChild = children[i];
    const leftChild: Children = children[i - 1];

    if (currChild.value > leftChild.value) {
      currChild.candy = leftChild.candy + 1;
    }
    if (currChild.value == leftChild.value) {
      currChild.candy = leftChild.candy;
    }
    if (currChild.value < leftChild.value) {
      currChild.candy = leftChild.candy - 1;
      currChild.flag = true;
    }

    if (currChild.candy < minimumCandy) {
      minimumCandy = currChild.candy;
    }
  }

  return children
    .map(({ candy }) => candy)
    .reduce((a, b) => a + b + (1 - minimumCandy));
}

console.log(candy([1, 2, 2]));
