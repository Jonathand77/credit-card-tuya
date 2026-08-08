using CreditCard.Application.Services;
using CreditCard.Tests.Fakes;
using Xunit;

namespace CreditCard.Tests.Services
{
    public class PaymentServiceTests
    {
        private static CreditCard.Domain.Entities.CreditCard MakeCard(Guid userId, decimal limit, decimal balance) =>
            new()
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Limit = limit,
                Balance = balance,
                CardNumberMasked = "**** **** **** 1234",
                CardNumberHash = "hash",
                Last4 = "1234",
                HolderName = "Test User",
                Expiry = "12/30",
                CvvHash = "hash"
            };

        [Fact]
        public async Task ChargeAsync_ConSaldoDisponible_CreaTransaccionYActualizaBalance()
        {
            var userId = Guid.NewGuid();
            var card = MakeCard(userId, limit: 1000m, balance: 200m);
            var cardRepo = new FakeCardRepository();
            cardRepo.Seed(card);
            var txRepo = new FakeTransactionRepository();
            var service = new PaymentService(cardRepo, txRepo);

            var tx = await service.ChargeAsync(userId, card.Id, 150m, "Compra de prueba");

            Assert.Equal(150m, tx.Amount);
            Assert.Equal("charge", tx.Type);
            Assert.Equal(350m, card.Balance);
            Assert.Single(txRepo.Transactions);
        }

        [Fact]
        public async Task ChargeAsync_ExcedeElLimite_LanzaExcepcion()
        {
            var userId = Guid.NewGuid();
            var card = MakeCard(userId, limit: 1000m, balance: 900m);
            var cardRepo = new FakeCardRepository();
            cardRepo.Seed(card);
            var service = new PaymentService(cardRepo, new FakeTransactionRepository());

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => service.ChargeAsync(userId, card.Id, 150m, null));
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-50)]
        public async Task ChargeAsync_MontoNoPositivo_LanzaExcepcion(decimal amount)
        {
            var userId = Guid.NewGuid();
            var card = MakeCard(userId, limit: 1000m, balance: 0m);
            var cardRepo = new FakeCardRepository();
            cardRepo.Seed(card);
            var service = new PaymentService(cardRepo, new FakeTransactionRepository());

            await Assert.ThrowsAsync<ArgumentException>(
                () => service.ChargeAsync(userId, card.Id, amount, null));
        }

        [Fact]
        public async Task ChargeAsync_TarjetaDeOtroUsuario_LanzaExcepcion()
        {
            var ownerId = Guid.NewGuid();
            var otherUserId = Guid.NewGuid();
            var card = MakeCard(ownerId, limit: 1000m, balance: 0m);
            var cardRepo = new FakeCardRepository();
            cardRepo.Seed(card);
            var service = new PaymentService(cardRepo, new FakeTransactionRepository());

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => service.ChargeAsync(otherUserId, card.Id, 50m, null));
        }
    }
}
