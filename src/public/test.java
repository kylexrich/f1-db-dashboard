
    public static void main(String args[]) {
      int x=10;
      int y=25;
      int z=x+y;

      System.out.println("Sum of x+y = " + z);
      foo(5);
    }
    static void foo(int a) {
  int x = a + 2;

  while(x < 11) {
    x = x + 1;
    assert x < 11; // (I) S = (a → U, x → W + 1) P = {W < 11}
  }
  x = 4;
  if(x == 3) {
    assert false;   // (II)  S = (a → U, x → Z) P = {Z >= 11, Z == 3}
  } else {
      x = 3;
    assert x != 3;
  } // stop before this line for 1(c)!
}

