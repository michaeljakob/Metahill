<script>
for (var i = 1; i <= 100; i++)
  console.log(
    (!(i % 3) ? "Fizz":) +
    (!(i % 5) ? "Buzz":) || i
  )
</script>